import { Module } from '@nestjs/common';

import { CommonModule } from './common/src/common.module';

@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class LibsModule {}
