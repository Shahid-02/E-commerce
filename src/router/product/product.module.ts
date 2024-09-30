import { Module } from '@nestjs/common';
import { Providers1Controller } from './product.controller';
import { Providers1Service } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), RedisModule],
  controllers: [Providers1Controller],
  providers: [Providers1Service],
})
export class Providers1Module {}
