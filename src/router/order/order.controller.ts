import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('/api/shop/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  createOrder(@Body() orderDto: OrderDto) {
    return this.orderService.createOrder(orderDto);
  }
  @Get('/list/:userId')
  async getAllOrdersByUser(@Param('userId') userId: number) {
    return this.orderService.getAllOrdersByUser(userId);
  }

  @Get('/details/:id')
  async getOrderDetails(@Param('id') id: number) {
    return this.orderService.getOrderDetails(id);
  }
}
