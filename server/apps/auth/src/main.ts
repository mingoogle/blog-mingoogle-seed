import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigurationService, LoggerService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configurationService = app.get(ConfigurationService);
  const serverName =
    configurationService.get<string>('AUTH_SERVER_NAME') || 'auth';
  const port = configurationService.getServerPort(serverName);
  const NODE_ENV = configurationService.get<string>('NODE_ENV');

  // microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9093'],
        clientId: 'seed',
      },
      consumer: {
        groupId: 'seed-groupId',
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(port, () => {
    app
      .get(LoggerService)
      .info(
        `[server] serverName: ${serverName}, starting: ${port}, NODE_ENV: ${NODE_ENV}`,
      );
  });
}
bootstrap();
