import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { Repository } from 'typeorm';

export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAllOrdersOfAllUsers() {
    try {
      const orders = await this.orderRepository.find();
      if (!orders) {
        throw new HttpException('No orders found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get all orders ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderDetailsForAdmin(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
      });
      if (!order) {
        throw new HttpException(
          `Order with ID: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to get order details for ID: ${id} ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateOrderStatus(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
      });
      if (!order) {
        throw new HttpException(
          `Order with ID: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      order.orderStatus = 'Delivered';
      await this.orderRepository.save(order);
      return {
        success: true,
        message: 'Order status updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update order status ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
