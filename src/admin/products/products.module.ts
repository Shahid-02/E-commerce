import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { CloudinaryModule } from 'src/helpers/cloudinary/cloudinary.module';
import { RedisModule } from 'src/redis/redis.module';
import { LoggerModule } from 'src/helpers/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CloudinaryModule,
    RedisModule,
    LoggerModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModules {}
