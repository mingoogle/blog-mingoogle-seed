import { Module, Inject } from '@nestjs/common';

import { LibsModule } from '@app/lib';
import { AppController } from './app.controller';
import { AppKafkaController } from './app.kafka.controller';
import { AppService } from './app.service';
import { LoggerService, KafkaService } from '@app/common';

@Module({
  imports: [LibsModule],
  controllers: [AppController, AppKafkaController],
  providers: [AppService],
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
