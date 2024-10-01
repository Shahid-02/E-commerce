import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { Order } from 'src/models/order.entity';
import { PaypalService } from 'src/helpers/easypaise/paypal.service';
import { CustomLogger } from 'src/helpers/logger/custom-logger.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paypalService: PaypalService,
    private readonly logger: CustomLogger,
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

      this.logger.log(`Creating order for user ID: ${userId}`);

      // Create PayPal payment (if enabled)
      // const paymentInfo = await this.paypalService.createPayment(cartItems, totalAmount);

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

      this.logger.log(`Order successfully created with ID: ${newOrder.id}`);

      // Find the approval URL (if using PayPal)
      // const approvalURL = paymentInfo.links.find(
      //   (link) => link.rel === "approval_url"
      // ).href;

      return {
        success: true,
        orderId: newOrder.id,
      };
    } catch (error) {
      this.logger.error('Error creating order', error.stack);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async getAllOrdersByUser(userId: number) {
    try {
      this.logger.log(`Fetching all orders for user ID: ${userId}`);

      const orders = await this.orderRepository.find({
        where: { id: userId },
      });

      if (!orders.length) {
        this.logger.warn(`No orders found for user ID: ${userId}`);
        return {
          success: false,
          message: 'No orders found!',
        };
      }

      this.logger.log(`Orders successfully fetched for user ID: ${userId}`);
      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Error fetching orders for user', error.stack);
      throw new InternalServerErrorException(
        'Some error occurred while fetching orders',
      );
    }
  }

  async getOrderDetails(id: number) {
    try {
      this.logger.log(`Fetching details for order ID: ${id}`);

      const order = await this.orderRepository.findOne({
        where: { id },
      });

      if (!order) {
        this.logger.warn(`Order with ID: ${id} not found`);
        return {
          success: false,
          message: 'Order not found!',
        };
      }

      this.logger.log(`Order details fetched for order ID: ${id}`);
      return {
        success: true,
        data: order,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching order details for order ID: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Some error occurred while fetching order details',
      );
    }
  }
}
