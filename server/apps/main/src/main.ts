import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigurationService, LoggerService } from '@app/common';

async function bootstrap() {
  const configurationService = new ConfigurationService();
  const serverName =
    configurationService.get<string>('MAIN_SERVER_NAME') || 'main';
  const port = configurationService.getServerPort(serverName);
  const NODE_ENV = configurationService.get<string>('NODE_ENV');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  await app.listen(port, () => {
    app
      .get(LoggerService)
      .info(
        `[server] serverName: ${serverName}, starting: ${port}, NODE_ENV: ${NODE_ENV}`,
      );
  });
}
bootstrap();
