import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModules } from './admin/products/products.module';
import { CloudinaryModule } from './helpers/cloudinary/cloudinary.module';
import { CommonModule } from './common/feature/feature.module';
import { Providers1Module } from './router/product/product.module';
import { ReviewModule } from './router/review/review.module';
import { RedisModule } from './redis/redis.module';
import { RatelimitingService } from './helpers/ratelimiting/ratelimiting.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RatelimitingModule } from './helpers/ratelimiting/ratelimiting.module';
import { APP_GUARD } from '@nestjs/core';
import { SearchModule } from './router/search/search.module';
import { CustomLogger } from './helpers/logger/custom-logger.service';
import { AddressModule } from './router/address/address.module';
import { OrderModule } from './admin/order/order.module';

@Module({
  imports: [
    // connect to the Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'khan72242',
      database: 'ecom',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
    AuthModule,
    ProductsModules,
    CloudinaryModule,
    CommonModule,
    Providers1Module,
    ReviewModule,
    SearchModule,
    AddressModule,
    OrderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: Logger,
      useClass: CustomLogger,
    },
  ],
})
export class RootModule {}
