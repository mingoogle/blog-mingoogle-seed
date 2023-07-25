import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService extends ConfigService {
  set(key: string, value: any) {
    process.env[key] = value;
  }

  private _isLocalEnvironment = () => {
    let env = this.get<string>('NODE_ENV');
    if (!env) {
      env = 'local';
      this.set('NODE_ENV', env);
    }

    if (env === 'local') {
      return true;
    }

    return false;
  };

  setConfigurationAtInitServer(serverName: string) {
    if (this._isLocalEnvironment()) {
      this.set('SERVER_NAME', serverName);
    }
  }

  getServerPort = (serverName: string) => {
    const targetPortString = `${serverName.toUpperCase()}_PORT`;
    const targetPort = this.get<string>(targetPortString);

    return targetPort;
  };

  getKafkaConfig() {
    const NODE_ENV = this.get('NODE_ENV') || 'local';
    const SERVER_NAME = this.get('SERVER_NAME');
    const prefixTopic =
      !NODE_ENV || NODE_ENV === 'local' ? 'development' : NODE_ENV;

    return {
      prefixTopic: NODE_ENV === 'production' ? null : prefixTopic,
      clientId: this.get('KAFKA_CLIENT_ID') || 'seed',
      brokers: [this.get('KAFKA_HOST') || 'localhost:9093'],
      groupId: `${NODE_ENV}-${SERVER_NAME}`,
      retryTime: 1000,
      retryCount: 3,
      readUncommitted: false,
      maxWaitTimeInMs: 100,
      sessionTimeout: 15000,
    };
  }
}
