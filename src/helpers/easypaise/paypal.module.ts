import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaypalModule {}
