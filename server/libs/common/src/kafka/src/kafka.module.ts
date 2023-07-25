import { Module } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import {
  ConfigurationModule,
  ConfigurationService,
} from '../../configuration/src';
import { LoggerModule, LoggerService } from '../../logger/src';
import { ValidationModule, ValidationService } from '../../validation/src';
import { KafkaService, TKafkaConfig } from './kafka.service';
import { ClsHookedModule } from '@app/common';

@Module({
  imports: [
    ConfigurationModule,
    LoggerModule,
    ValidationModule,
    ClsHookedModule,
  ],
  providers: [
    {
      provide: 'KAFKA_SERVICE',
      inject: [
        ConfigurationService,
        LoggerService,
        ValidationService,
        ClsService,
      ],
      useFactory: (
        configService: ConfigurationService,
        loggerService: LoggerService,
        validationService: ValidationService,
        clsService: ClsService,
      ) => {
        const kafkaConfig: TKafkaConfig = configService.getKafkaConfig();
        return new KafkaService(
          kafkaConfig,
          loggerService,
          validationService,
          clsService,
        );
      },
    },
  ],
  exports: ['KAFKA_SERVICE'],
})
export class KafkaModule {}
