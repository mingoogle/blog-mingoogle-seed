import { Module, Inject } from '@nestjs/common';

import { LibsModule } from '@app/lib';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService, KafkaService } from '@app/common';

@Module({
  imports: [LibsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const initialize = async (): Promise<void> => {
      // kafka initialize
      await this.kafkaService.init();
      await this.kafkaService.produceGroupProcessor();
      await this.kafkaService.consumeGroupProcessor();
    };
    try {
      await initialize();
    } catch (err) {
      this.logger.warn(err, 'Initialization failed.');
    }
  }
}
