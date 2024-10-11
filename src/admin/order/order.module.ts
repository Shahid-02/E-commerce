import { Module } from '@nestjs/common';
import { orderController } from './order.controller';
import { OrdersService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [orderController],
  providers: [OrdersService],
})
export class OrderModule {}
