import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { LibsModule } from '@app/lib';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LibsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'seed',
            brokers: ['localhost:9093'],
          },
          consumer: {
            groupId: 'seed-groupId',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
