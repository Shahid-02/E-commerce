import { Module } from '@nestjs/common';
import { Providers1Controller } from './product.controller';
import { Providers1Service } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';
import { RedisModule } from 'src/redis/redis.module';
import { LoggerModule } from 'src/helpers/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), RedisModule, LoggerModule],
  controllers: [Providers1Controller],
  providers: [Providers1Service],
})
export class Providers1Module {}
