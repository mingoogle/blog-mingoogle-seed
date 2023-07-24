import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    console.log('### [start] main server hello =>');
    return this.appService.getHello();
  }

  @Post('/publishToKafka')
  async publishToKafka(): Promise<any> {
    try {
      await this.kafkaClient.connect();
      await this.kafkaClient.emit('kafka-topic-message', {
        message: '토픽 메세지입니다.',
      });
      // await this.kafkaClient.close();
      return { message: 'Message published successfully' };
    } catch (err) {
      console.log('### err =>', err);
      return { error: 'Failed to publish message' };
    }
  }
}
