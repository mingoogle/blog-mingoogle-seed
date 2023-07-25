import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

import { KAFKA_MAP, KafkaTopicMessage } from '@app/common';

const KAFKA_CONSUMER_MAP_APP =
  KAFKA_MAP.auth.consumer.app['/app.kafka.controller'];

@Controller('kafka')
export class AppKafkaController {
  @MessagePattern(KAFKA_CONSUMER_MAP_APP.KAFKA_TOPIC_MESSAGE, Transport.KAFKA)
  getKafkaConsumer(@Payload() data: KafkaTopicMessage) {
    console.log('### kafka-topic-message consumer => \n', data);
  }
}
