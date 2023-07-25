import { Module, Inject } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsInterceptor } from 'nestjs-cls';

import { LibsModule } from '@app/lib';
import { AppController } from './app.controller';
import { AppKafkaController } from './app.kafka.controller';
import { AppService } from './app.service';
import { LoggerService, KafkaService } from '@app/common';
import { TraceInterceptor } from '@app/interceptor';

@Module({
  imports: [LibsModule],
  controllers: [AppController, AppKafkaController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceInterceptor,
    },
  ],
})
export class AppModule {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
  ) {}

  // 호스트 모듈의 종속성이 해결되면 호출됩니다.
  async onModuleInit(): Promise<void> {
    console.log('### start initialize');
    const initialize = async (): Promise<void> => {
      // kafka initialize
      await this.kafkaService.init();
      // await this.kafkaService.produceGroupProcessor();
      await this.kafkaService.consumeGroupProcessor();
    };
    try {
      await initialize();
    } catch (err) {
      this.logger.warn(err, 'Initialization failed.');
    }
  }
}
