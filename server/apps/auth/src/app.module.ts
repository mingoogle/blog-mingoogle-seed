import { Module } from '@nestjs/common';

import { LibsModule } from '@app/lib';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppKafkaController } from './app.kafka.controller';

@Module({
  imports: [LibsModule],
  controllers: [AppController, AppKafkaController],
  providers: [AppService],
})
export class AppModule {}
