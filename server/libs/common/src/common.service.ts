import { Injectable } from '@nestjs/common';
import { delay } from 'lodash';

import { LoggerService } from './logger/src';

@Injectable()
export class CommonService {
  constructor(private readonly logger: LoggerService) {
    logger.info('CommonService initialize Start!');
  }

  delayTime(ms: number): Promise<void> {
    return new Promise((resolve) => {
      delay(resolve, ms);
    });
  }
}
