import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { Repository } from 'typeorm';

export class SearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async searchProducts(keyword: string) {
    try {
      const searchResults = await this.productRepository
        .createQueryBuilder('product')
        .where('product.title ILIKE :keyword', { keyword: `%${keyword}%` })
        .orWhere('product.description ILIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .orWhere('product.category ILIKE :keyword', { keyword: `%${keyword}%` })
        .orWhere('product.brand ILIKE :keyword', { keyword: `%${keyword}%` })
        .getMany();

      return {
        success: true,
        data: searchResults,
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
