import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RatelimitingService extends ThrottlerGuard {
  protected async getTracker(requestProps: ThrottlerRequest): Promise<any> {
    const {
      context,
      limit,
      ttl,
      throttler,
      blockDuration,
      getTracker,
      generateKey,
    } = requestProps;
    console.log(limit, ttl, throttler, blockDuration, 'sdnvjkd');
  }
}
