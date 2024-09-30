import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class Providers1Service {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async getFilteredProducts(query: any) {
    try {
      const client = this.redisService.getClient();
      // Check cache first
      const cachedData = await client.get(JSON.stringify(query));
      if (cachedData) {
        return {
          success: true,
          message: 'Data retrieved from cache',
          data: JSON.parse(cachedData),
        };
      }

      const { category = '', brand = '', sortBy = 'price-lowtohigh' } = query;

      let filters: any = {};

      if (category) {
        filters['category'] = { $in: category.split(',') };
      }

      if (brand) {
        filters['brand'] = { $in: brand.split(',') };
      }

      let sort: any = {};

      switch (sortBy) {
        case 'price-lowtohigh':
          sort['price'] = 'ASC';
          break;
        case 'price-hightolow':
          sort['price'] = 'DESC';
          break;
        case 'title-atoz':
          sort['title'] = 'ASC';
          break;
        case 'title-ztoa':
          sort['title'] = 'DESC';
          break;
        default:
          sort['price'] = 'ASC';
          break;
      }

      const products = await this.productRepository.find({
        where: filters,
        order: sort,
      });

      // Cache the result
      await client.set(
        JSON.stringify(query),
        JSON.stringify(products),
        'EX',
        3600,
      ); // 1 hour cache

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.log(error.message);
      throw new Error('Some error occurred');
    }
  }

  async getProductDetails(id: number) {
    try {
      const client = this.redisService.getClient();
      const cachedProduct = await client.get(`product-${id}`);
      if (cachedProduct) {
        return {
          success: true,
          message: 'Data retrieved from cache',
          data: JSON.parse(cachedProduct),
        };
      }

      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new Error('Product not found');
      }

      // Cache product details
      await client.set(`product-${id}`, JSON.stringify(product), 'EX', 3600); // 1 hour cache

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Some error occurred',
      };
    }
  }
}
