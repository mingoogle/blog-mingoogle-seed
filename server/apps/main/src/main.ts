import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigurationService, LoggerService } from '@app/common';

async function bootstrap() {
  const configurationService = new ConfigurationService();
  const serverName = configurationService.get<string>('SERVER_NAME') || 'main';
  configurationService.setConfigurationAtInitServer(serverName);
  const port = configurationService.getServerPort(serverName);
  const NODE_ENV = configurationService.get<string>('NODE_ENV');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // NOTE: main서버에 컨슈머를 사용한다면 microservice 설정해주어야합니다.(@MessagePattern)
  app.connectMicroservice(
    {
      strategy: app.get('KAFKA_SERVICE'),
    },
    {
      inheritAppConfig: true,
    },
  );
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
