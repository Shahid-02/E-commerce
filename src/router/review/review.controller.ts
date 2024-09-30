import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';
import { ProductReviewService } from './review.service';

@Controller('/api/shop/review')
export class ProductReviewController {
  constructor(private readonly reviewService: ProductReviewService) {}

  @Post('/add')
  async addProductReview(@Body() reviewDto: ReviewDto) {
    return this.reviewService.addProductReview(reviewDto);
  }

  @Get('/:productId')
  async getProductReviews() {}
}
