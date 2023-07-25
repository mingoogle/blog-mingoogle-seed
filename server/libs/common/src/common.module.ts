import { Module } from '@nestjs/common';

import { CommonService } from './common.service';
import { LoggerModule } from './logger/src';
import { ConfigurationModule } from './configuration/src';
import { KafkaModule } from './kafka/src';

@Module({
  providers: [CommonService],
  imports: [ConfigurationModule, LoggerModule, KafkaModule],
  exports: [CommonService, ConfigurationModule, LoggerModule, KafkaModule],
})
export class CommonModule {}
