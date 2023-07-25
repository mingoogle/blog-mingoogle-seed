import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { LoggerService } from '@app/common';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  constructor(
    private readonly clsService: ClsService,
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      // kafka
      if (context.getType() === 'rpc') {
        const traceId = context.getArgByIndex(0)?.traceId || uuidv4();
        this.clsService.set('traceId', traceId);
        return next.handle();
      }

      // http
      if (context.getType() === 'http') {
        const request = context.switchToHttp().getRequest();
        const traceId = request.headers['x-request-id'] || uuidv4();
        this.clsService.set('traceId', traceId);
        return next.handle();
      }
    } catch (err) {
      this.logger.error(err, '[TraceInterceptor] unknown error in interceptor');
      return next.handle();
    }
  }
}
