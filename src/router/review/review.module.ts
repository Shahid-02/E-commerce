import { Module } from '@nestjs/common';
import { ProductReviewController } from './review.controller';
import { ProductReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from 'src/models/review.entity';
import { Product } from 'src/models/product.entity';
import { Order } from 'src/models/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview, Product, Order])],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ReviewModule {}
