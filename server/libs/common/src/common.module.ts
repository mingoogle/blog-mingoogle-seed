import { Module } from '@nestjs/common';

import { CommonService } from './common.service';
import { LoggerModule } from './logger/src';
import { ConfigurationModule } from './configuration/src';
import { KafkaModule } from './kafka/src';
import { ClsHookedModule } from './cls-hooked/src';

@Module({
  providers: [CommonService],
  imports: [ConfigurationModule, LoggerModule, KafkaModule, ClsHookedModule],
  exports: [
    CommonService,
    ConfigurationModule,
    LoggerModule,
    KafkaModule,
    ClsHookedModule,
  ],
})
export class CommonModule {}
