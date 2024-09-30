import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { Order } from 'src/models/order.entity';
import { PaypalService } from 'src/helpers/easypaise/paypal.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paypalService: PaypalService,
  ) {}

  async createOrder(orderDto: OrderDto) {
    try {
      const {
        userId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
        cartId,
      } = orderDto;

      // Create PayPal payment
      //   const paymentInfo = await this.paypalService.createPayment(cartItems, totalAmount);÷

      // Create and save the order
      const newOrder = this.orderRepository.create({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
      });

      await this.orderRepository.save(newOrder);

      // Find the approval URL
      //   const approvalURL = paymentInfo.links.find(
      //     (link) => link.rel === "approval_url"
      //   ).href;

      return {
        success: true,
        orderId: newOrder.id,
      };
    } catch (error) {
      console.error('Error creating order:', error.message);
      throw new InternalServerErrorException('Failed to create order');
    }
  }
}
