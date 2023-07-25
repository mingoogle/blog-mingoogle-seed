import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { set } from 'lodash';

import { LoggerService } from '../../logger/src';
import { ValidationService } from '../../validation/src';
import { CustomError } from '../../error';

import { TopicMessageMap } from './topics';
import { SYSTEM } from '../../../../constants';

export type TTopicMessage = {
  topic: string;
  messages: [{ value: string }];
};

export type TKafkaConfig = {
  prefixTopic: string;
  clientId: string;
  brokers: string[];
  groupId: string;
  retryTime: number;
  retryCount: number;
  readUncommitted: boolean;
  maxWaitTimeInMs: number;
  sessionTimeout: number;
};

export class KafkaService extends Server implements CustomTransportStrategy {
  private kafka: Kafka;

  private producer: Producer;

  private consumer: Consumer;

  constructor(
    private readonly kafkaConfig: TKafkaConfig,
    private readonly loggerService: LoggerService,
    private readonly validationService: ValidationService,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  /**
   * 환경에 맞게 토픽 명 세팅
   * ex) {development or production or qc}.xxx.xxx
   * @param {string} topicName - 토픽명
   */
  private _setTopicByEnvironment(topicName: string): string {
    const result = this.kafkaConfig.prefixTopic
      ? `${this.kafkaConfig.prefixTopic}.${topicName}`
      : topicName;
    return result;
  }

  /**
   * consume 시 호출되는 핸들러를 환경변수에 맞게 세팅
   * - @MessagePattern(topicName) 데코레이터의 topicName 파라미터 값에 prefix{development or production}를 세팅.
   */
  private _setMessageHandler() {
    [...this.messageHandlers.entries()].map(([pattern]) => {
      const setTopicName = this._setTopicByEnvironment(pattern);
      this.messageHandlers.set(setTopicName, this.messageHandlers.get(pattern));
      this.messageHandlers.delete(pattern);
    });
  }

  async init() {
    this.kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: this.kafkaConfig.brokers,
      retry: {
        initialRetryTime: this.kafkaConfig.retryTime,
        retries: this.kafkaConfig.retryCount,
      },
    });

    this._setMessageHandler();
  }

  /**
   * main.js 에서 app.listen() 호출 시 실행됨".
   */
  async listen(callback: () => void) {
    callback();
  }

  /**
   * application shutdown 이벤트 발생 시 실행됨
   * CustomTransportStrategy가 인터페이스라 반드시 선언해야함
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async close() {}

  /**
   * producer init".
   */
  async produceGroupProcessor() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  /**
   * consumer init
   */
  async consumeGroupProcessor() {
    this.consumer = this.kafka.consumer({
      groupId: this.kafkaConfig.groupId,
      readUncommitted: this.kafkaConfig.readUncommitted,
      sessionTimeout: this.kafkaConfig.sessionTimeout,
      maxWaitTimeInMs: this.kafkaConfig.maxWaitTimeInMs,
    });
    await this.consumer.connect();

    // 컨슘할 토픽 구독
    for (const [pattern] of this.messageHandlers.entries()) {
      try {
        await this.consumer.subscribe({
          topic: pattern,
          fromBeginning: false,
        });
      } catch (err) {
        this.loggerService.error(
          err,
          `error during the consumer subscription. topic: ${pattern}`,
        );
        throw new CustomError(
          SYSTEM.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR,
          `[libs/kafka/kafkaService] error during the consumer subscription. topic: ${pattern}`,
        );
      }
    }

    // 구독한 토픽들이 컨슘될 때 실행
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // message 값이 buffer 로 들어옴
          const messageValue = JSON.parse(message?.value?.toString());
          const handler = this['messageHandlers'].get(topic);
          if (handler) {
            const handled = await handler(messageValue, message);
            if (handled instanceof Observable) {
              const subscription = handled.subscribe({
                complete: () => {
                  subscription.unsubscribe();
                },
                error: (err) => {
                  this.loggerService.error(
                    err,
                    '[libs/kafka/kafkaService] eachMessage handler err',
                  );
                },
              });
            }
          }
        } catch (err) {
          this.loggerService.error(
            err,
            `[libs/kafka/kafkaService] eachMessage err topic: ${topic} message: ${message?.value?.toString()}`,
          );
        }
      },
    });
  }

  /**
   * consumers 종료
   * 참고
   * disconnect(): 네트워크 연결도 끊어진 상태로 Consumer 인스턴스와 kafka서버의 연결이 완전히 종료됨
   * stop(): 네트워크 연결을 유지하고있지만 더 이상의 컨슘을 진행하지 않음 (재시작시 기존에 할당받은 파티션이 유지되어있음)
   */
  async closeConsumers() {
    await this.consumer.disconnect();
  }

  /**
   * producer 종료
   */
  async closeProducer() {
    await this.producer.disconnect();
  }

  /**
   * 토픽메세지 세팅 작업 및 검증 작업
   * - 검증 작업
   *   1. 토픽명에 해당하는 토픽메시지 검증
   *   2. 토픽메시지 내부를 검증
   * @param {string} topic - TopicMessageMap에 정의된 토픽명
   * @param {object} message- TopicMessageMap에 정의된 클래스 인스턴스
   */
  async setTopicMessage<T extends keyof typeof TopicMessageMap>(
    topic: T,
    message: InstanceType<(typeof TopicMessageMap)[T]>,
  ): Promise<TTopicMessage> {
    const traceId = this.clsService.get('traceId');
    set(message, 'traceId', traceId);

    // 토픽메시지 내부 검증
    try {
      await this.validationService.validate({
        type: TopicMessageMap[topic],
        value: message,
      });
    } catch (err) {
      throw new CustomError(
        SYSTEM.ERROR.ERROR_CODE.VALIDATION_ERROR,
        `[libs/kafka/kafkaService] ${TopicMessageMap[topic]} validation error!`,
      );
    }

    const setTopicName = this._setTopicByEnvironment(topic);
    const topicMessage: TTopicMessage = {
      topic: setTopicName,
      messages: [{ value: JSON.stringify(message) }],
    };

    return topicMessage;
  }

  /**
   * 한개의 topic에 producing
   * @param topicMessage - TTopicMessage 타입
   */
  async produceSingleMessage(topicMessage: TTopicMessage): Promise<void> {
    try {
      await this.producer.send({
        ...topicMessage,
        acks: -1,
        timeout: 5000,
      });
    } catch (err) {
      this.loggerService.error(
        { topicMessage: topicMessage, err },
        `[libs/kafka/kafkaService] [produce topic: ${topicMessage.topic}] Topic send fail`,
      );
      throw new CustomError(
        SYSTEM.ERROR.ERROR_CODE.INTERNAL_SERVER_ERROR,
        `[libs/kafka/kafkaService] [produce topic: ${topicMessage.topic}] Topic send fail`,
      );
    }
  }
}
