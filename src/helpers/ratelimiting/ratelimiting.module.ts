import { Module } from '@nestjs/common';
import { RatelimitingService } from './ratelimiting.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [],
  controllers: [],
  providers: [RatelimitingService],
  exports: [RatelimitingService],
})
export class RatelimitingModule {}
