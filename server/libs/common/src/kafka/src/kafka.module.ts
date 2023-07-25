import { Module } from '@nestjs/common';

import {
  ConfigurationModule,
  ConfigurationService,
} from '../../configuration/src';
import { LoggerModule, LoggerService } from '../../logger/src';
import { ValidationModule, ValidationService } from '../../validation/src';
import { KafkaService, TKafkaConfig } from './kafka.service';

@Module({
  imports: [ConfigurationModule, LoggerModule, ValidationModule],
  providers: [
    {
      provide: 'KAFKA_SERVICE',
      inject: [ConfigurationService, LoggerService, ValidationService],
      useFactory: (
        configService: ConfigurationService,
        loggerService: LoggerService,
        validationService: ValidationService,
      ) => {
        const kafkaConfig: TKafkaConfig = configService.getKafkaConfig();
        return new KafkaService(kafkaConfig, loggerService, validationService);
      },
    },
  ],
  exports: ['KAFKA_SERVICE'],
})
export class KafkaModule {}
