import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { LoggerService } from './logger.service';
import {
  ConfigurationModule,
  ConfigurationService,
} from '../../configuration/src';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        const NODE_ENV = configurationService.get<string>('NODE_ENV');
        return {
          pinoHttp: {
            autoLogging: false,
            quietReqLogger: false,
            level: NODE_ENV === 'production' ? 'info' : 'debug',
            transport:
              !NODE_ENV || NODE_ENV === 'local'
                ? {
                    target: 'pino-pretty', // only local
                  }
                : undefined,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
