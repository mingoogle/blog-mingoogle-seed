import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

@Controller('kafka')
export class AppKafkaController {
  @MessagePattern('kafka-topic-message', Transport.KAFKA)
  getKafkaConsumer(@Payload() data: any) {
    console.log('### kafka-topic-message consumer => \n', data);
  }
}
