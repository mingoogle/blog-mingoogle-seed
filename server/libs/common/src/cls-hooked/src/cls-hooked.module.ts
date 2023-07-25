import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [ClsModule.forRoot()],
  exports: [ClsModule],
})
export class ClsHookedModule {}
