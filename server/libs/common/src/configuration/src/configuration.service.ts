import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService extends ConfigService {
  getServerPort = (serverName: string) => {
    const targetPortString = `${serverName.toUpperCase()}_PORT`;
    const targetPort = this.get<string>(targetPortString);

    return targetPort;
  };
}
