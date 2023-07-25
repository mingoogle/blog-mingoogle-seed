import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';

import {
  KafkaService,
  KAFKA_MAP,
  TTopicMessage,
  KafkaTopicMessage,
} from '@app/common';

const KAFKA_PRODUCER_MAP_APP = KAFKA_MAP.main.producer.app['/app.controller'];

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: KafkaService,
  ) {}

  @Get()
  getHello(): string {
    console.log('### [start] main server hello =>');
    return this.appService.getHello();
  }

  @Post('/publishToKafka')
  async publishToKafka(): Promise<any> {
    try {
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
      return { message: 'Message published successfully' };
    } catch (err) {
      console.log('### err =>', err);
      return { error: 'Failed to publish message' };
    }
  }
}
