import { Module } from '@nestjs/common';

import { CommonService } from './common.service';
import { LoggerModule } from './logger/src';
import { ConfigurationModule } from './configuration/src';

@Module({
  providers: [CommonService],
  imports: [ConfigurationModule, LoggerModule],
  exports: [CommonService, ConfigurationModule, LoggerModule],
})
export class CommonModule {}
