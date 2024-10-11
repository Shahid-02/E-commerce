import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLogger } from 'src/helpers/logger/custom-logger.service';
import { Product } from 'src/models/product.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class Providers1Service {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
    private readonly logger: CustomLogger,
  ) {}

  async getFilteredProducts(query: any) {
    try {
      const client = this.redisService.getClient();
      this.logger.log('Checking cache for filtered products');

      // // Check cache first
      // const cachedData = await client.get(JSON.stringify(query));
      // if (cachedData) {
      //   this.logger.log('Cache hit for filtered products');
      //   return {
      //     success: true,
      //     message: 'Data retrieved from cache',
      //     data: JSON.parse(cachedData),
      //   };
      // }

      this.logger.log('Cache miss, querying database for filtered products');
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

      this.logger.log('Database query successful, caching the result');

      // // Cache the result
      // await client.set(
      //   JSON.stringify(query),
      //   JSON.stringify(products),
      //   'EX',
      //   3600,
      // ); // 1 hour cache

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      this.logger.error(
        'Error while retrieving filtered products',
        error.stack,
      );
      throw new Error('Some error occurred');
    }
  }

  async getProductDetails(id: number) {
    try {
      const client = this.redisService.getClient();
      this.logger.log(`Checking cache for product with ID: ${id}`);

      const cachedProduct = await client.get(`product-${id}`);
      if (cachedProduct) {
        this.logger.log(`Cache hit for product with ID: ${id}`);
        return {
          success: true,
          message: 'Data retrieved from cache',
          data: JSON.parse(cachedProduct),
        };
      }

      this.logger.log(
        `Cache miss, querying database for product with ID: ${id}`,
      );
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        this.logger.warn(`Product with ID: ${id} not found in the database`);
        throw new Error('Product not found');
      }

      this.logger.log(
        `Database query successful for product with ID: ${id}, caching the result`,
      );

      // Cache product details
      await client.set(`product-${id}`, JSON.stringify(product), 'EX', 3600); // 1 hour cache

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      this.logger.error(
        `Error while retrieving product details for ID: ${id}`,
        error.stack,
      );
      return {
        success: false,
        message: 'Some error occurred',
      };
    }
  }
}
