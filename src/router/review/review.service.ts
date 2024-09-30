import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/review.dto';
import { ProductReview } from 'src/models/review.entity';
import { Product } from 'src/models/product.entity';
import { Order } from 'src/models/order.entity';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async addProductReview(reviewDto: ReviewDto) {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      reviewDto;

    try {
      // Check if the user has purchased the product
      const order = await this.orderRepository.findOne({
        where: {
          id: userId,
          //  cartItems: { productId },
        },
      });

      if (!order) {
        return {
          success: false,
          message: 'You need to purchase the product to review it.',
        };
      }

      // Check if the user already reviewed the product
      const existingReview = await this.productReviewRepository.findOne({
        where: { productId, userId },
      });

      if (existingReview) {
        return {
          success: false,
          message: 'You have already reviewed this product.',
        };
      }

      // Create a new review
      const newReview = this.productReviewRepository.create({
        productId,
        userId,
        userName,
        reviewMessage,
        reviewValue,
      });

      await this.productReviewRepository.save(newReview);

      // Calculate the new average rating
      const reviews = await this.productReviewRepository.find({
        where: { productId },
      });
      const totalReviews = reviews.length;
      const averageReview =
        reviews.reduce((sum, review) => sum + review.reviewValue, 0) /
        totalReviews;

      // Update the product with the new average review score
      await this.productRepository.update(productId, { averageReview });

      return {
        success: true,
        data: newReview,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'An error occurred while adding the review.',
      };
    }
  }
}
