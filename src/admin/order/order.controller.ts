import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { OrdersService } from './order.service';
import { Response } from 'express';

@Controller('/api/admin/orders')
export class orderController {
  constructor(private readonly orderService: OrdersService) {}

  @Post('/get')
  async getAllOrdersOfAllUsers(@Res() res: Response) {
    return await this.orderService.getAllOrdersOfAllUsers();
  }
  @Get('details/:id')
  async getOrderDetailsForAdmin(@Param('id') id: number) {
    return this.orderService.getOrderDetailsForAdmin(id);
  }
  @Put('/update/:id')
  async updateOrderStatus(@Param('id') id: number) {
    return this.orderService.updateOrderStatus(id);
  }
}
