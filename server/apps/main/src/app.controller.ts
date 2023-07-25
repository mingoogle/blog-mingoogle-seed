import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClsService } from 'nestjs-cls';

import {
  KafkaService,
  LoggerService,
  KAFKA_MAP,
  TTopicMessage,
  KafkaTopicMessage,
} from '@app/common';

const KAFKA_PRODUCER_MAP_APP = KAFKA_MAP.main.producer.app['/app.controller'];

@Controller()
export class AppController {
  constructor(
    private readonly logger: LoggerService,
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: KafkaService,
    private readonly clsService: ClsService,
  ) {}

  @Get()
  getHello(): string {
    console.log('### [start] main server hello =>');
    return this.appService.getHello();
  }

  @Post('/publishToKafka')
  async publishToKafka(): Promise<any> {
    try {
      const traceId = this.clsService.get('traceId');
      this.logger.warn(`mainController traceId => ${traceId}`);
      const kafkaTopicMessage: KafkaTopicMessage = {
        name: '민구글',
        title: '카프카 실습2',
        eventTime: new Date().getTime(),
      };

      const invaildKafkaTopicMessage = {
        address: '민구글',
        contents: '카프카 실습2',
        eventTime: new Date().getTime(),
      };

      // NOTE: kafkaTopicMessage대신 invaildKafkaTopicMessage를 선언하면 벨리데이션 에러 발생!
      const kafkaMessage: TTopicMessage =
        await this.kafkaService.setTopicMessage(
          KAFKA_PRODUCER_MAP_APP.KAFKA_TOPIC_MESSAGE,
          kafkaTopicMessage,
        );
      await this.kafkaService.produceSingleMessage(kafkaMessage);

      this.logger.warn(kafkaMessage, '[mainController] kafkaMessage');
      console.log('### [mainController] kafkaMessage =>', kafkaMessage);
      console.log(`### [mainController] traceId => ${traceId}`);

      return { message: 'Message published successfully' };
    } catch (err) {
      this.logger.error(err, 'mainController error');
      return { error: 'Failed to publish message' };
    }
  }
}
