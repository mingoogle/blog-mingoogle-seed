import { Module } from '@nestjs/common';

import { ValidationService } from './validation.service';
import { LoggerModule } from '../../logger/src';

@Module({
  imports: [LoggerModule],
  providers: [ValidationService],
  exports: [ValidationService],
})
export class ValidationModule {}
