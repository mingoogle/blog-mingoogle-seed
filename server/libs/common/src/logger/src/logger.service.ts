import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ClsService } from 'nestjs-cls';

type LogInfo = {
  data?: object;
  err?: object;
  message: string;
  traceId: string;
};

@Injectable()
export class LoggerService {
  constructor(
    private readonly pinoLogger: PinoLogger,
    private readonly clsService: ClsService,
  ) {}

  private _format(obj: object | string, message: string = '') {
    // traceId 세팅
    const traceId = this.clsService.get('traceId');

    const result: LogInfo = { message, traceId };
    if (obj instanceof Error) {
      result.err = obj;
      return result;
    }

    if (typeof obj === 'string') {
      result.message = `${obj} ${message}`;
    } else {
      result.data = obj;
    }

    return result;
  }

  debug(object: object | string, message?: string) {
    const result = this._format(object, message);
    this.pinoLogger.debug(result);
  }

  info(object: object | string, message?: string) {
    const result = this._format(object, message);
    this.pinoLogger.info(result);
  }

  warn(object: object | string, message?: string) {
    const result = this._format(object, message);
    this.pinoLogger.warn(result);
  }

  error(object: object | string, message?: string) {
    const result = this._format(object, message);
    this.pinoLogger.error(result);
  }

  fatal(object: object | string, message?: string) {
    const result = this._format(object, message);
    this.pinoLogger.fatal(result);
  }
}
