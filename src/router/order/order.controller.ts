import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('/api/shop/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  createOrder(@Body() orderDto: OrderDto) {
    return this.orderService.createOrder(orderDto);
  }
}
