import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { ClsService } from 'nestjs-cls';

import { KAFKA_MAP, KafkaTopicMessage, LoggerService } from '@app/common';

const KAFKA_CONSUMER_MAP_APP =
  KAFKA_MAP.auth.consumer.app['/app.kafka.controller'];

@Controller('kafka')
export class AppKafkaController {
  constructor(
    private readonly logger: LoggerService,
    private readonly clsService: ClsService,
  ) {}

  @MessagePattern(KAFKA_CONSUMER_MAP_APP.KAFKA_TOPIC_MESSAGE, Transport.KAFKA)
  getKafkaConsumer(@Payload() data: KafkaTopicMessage) {
    const traceId = this.clsService.get('traceId');

    this.logger.warn(data, `[authController] traceId => ${traceId}`);
    console.log('### [authController] data => ', data);
    console.log(`### [authController] traceId => ${traceId}`);
  }
}
