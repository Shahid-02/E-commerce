import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/products.dot';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { CustomLogger } from 'src/helpers/logger/custom-logger.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
    private readonly logger: CustomLogger,
  ) {}

  async addProducts(productsDot: ProductDto) {
    try {
      this.logger.log('Attempting to add a new product');

      const newlyCreatedProduct = this.productRepository.create(productsDot);
      await this.productRepository.save(newlyCreatedProduct);

      const client = this.redisService.getClient();
      await client.flushdb();

      this.logger.log('Product added successfully and cache cleared');
      return {
        success: true,
        data: newlyCreatedProduct,
      };
    } catch (error) {
      this.logger.error('Error adding product', error.stack);
      throw new HttpException('Error adding products', HttpStatus.BAD_REQUEST);
    }
  }

  async fetchAllProducts() {
    try {
      this.logger.log('Fetching all products from the database or cache');

      const client = this.redisService.getClient();
      // Check cache first
      const cachedData = await client.get('products');
      if (cachedData) {
        this.logger.log('Products retrieved from cache');
        return {
          success: true,
          message: 'Data retrieved from cache',
          data: JSON.parse(cachedData),
        };
      }

      const listOfProducts = await this.productRepository.find();
      await client.set('products', JSON.stringify(listOfProducts), 'EX', 3600);

      this.logger.log('Products retrieved from database and cached');
      return {
        success: true,
        data: listOfProducts,
      };
    } catch (error) {
      this.logger.error('Error fetching products', error.stack);
      throw new Error('Some error occurred');
    }
  }

  async editProduct(id: number, updatedProduct: ProductDto) {
    try {
      this.logger.log(`Attempting to edit product with ID: ${id}`);

      const findProduct = await this.productRepository.findOne({
        where: { id },
      });

      if (!findProduct) {
        this.logger.warn(`Product with ID: ${id} not found`);
        throw new Error('Product not found');
      }

      Object.assign(findProduct, updatedProduct);
      await this.productRepository.save(findProduct);

      this.logger.log(`Product with ID: ${id} successfully updated`);
      return {
        success: true,
        data: findProduct,
      };
    } catch (error) {
      this.logger.error(`Error editing product with ID: ${id}`, error.stack);
      throw new Error('Some error occurred');
    }
  }

  async deleteProduct(id: number) {
    this.logger.log(`Attempting to delete product with ID: ${id}`);

    try {
      const findProduct = await this.productRepository.findOne({
        where: { id },
      });

      if (!findProduct) {
        this.logger.warn(`Product with ID: ${id} not found`);
        throw new Error('Product not found');
      }

      await this.productRepository.delete(id);

      this.logger.log(`Product with ID: ${id} deleted successfully`);
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting product with ID: ${id}`, error.stack);
      throw new Error('Some error occurred');
    }
  }
}
