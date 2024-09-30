import { Module } from '@nestjs/common';
import { MiddlewareService } from './middlerware.service';

@Module({
  controllers: [],
  providers: [MiddlewareService],
  exports: [MiddlewareService],
})
export class MiddlerWareModule {}
