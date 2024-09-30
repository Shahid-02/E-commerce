import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/products.dot';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async addProducts(productsDot: ProductDto) {
    try {
      const newlyCreatedProduct = this.productRepository.create(productsDot);
      await this.productRepository.save(newlyCreatedProduct);
      const client = this.redisService.getClient();
      await client.flushdb();
      return {
        success: true,
        data: newlyCreatedProduct,
      };
    } catch (error) {
      console.log(error.massage);
      throw new HttpException('Error adding products', HttpStatus.BAD_REQUEST);
    }
  }

  async fetchAllProducts() {
    try {
      const client = this.redisService.getClient();
      // Check cache first
      const cachedData = await client.get('products');
      if (cachedData) {
        return {
          success: true,
          message: 'Data retrieved from cache',
          data: JSON.parse(cachedData),
        };
      }

      const listOfProducts = await this.productRepository.find();
      await client.set('products', JSON.stringify(listOfProducts), 'EX', 3600);
      return {
        success: true,
        data: listOfProducts,
      };
    } catch (error) {
      console.log(error.message);
      throw new Error('Some error occurred');
    }
  }

  async editProduct(id: number, updatedProduct: ProductDto) {
    try {
      const findProduct = await this.productRepository.findOne({
        where: { id },
      });

      if (!findProduct) {
        throw new Error('Product not found');
      }

      Object.assign(findProduct, updatedProduct);
      await this.productRepository.save(findProduct);

      return {
        success: true,
        data: findProduct,
      };
    } catch (error) {
      console.log(error.message);
      throw new Error('Some error occurred');
    }
  }

  async deleteProduct(id: number) {
    console.log(id, ' here in the database ???');

    try {
      const findProduct = await this.productRepository.findOne({
        where: { id },
      });

      if (!findProduct) {
        throw new Error('Product not found');
      }

      await this.productRepository.delete(id);

      return {
        success: true,
        message: 'Product delete successfully',
      };
    } catch (error) {
      console.log(error);
      throw new Error('Some error occurred');
    }
  }
}
