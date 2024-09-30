import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModules } from './admin/products/products.module';
import { CloudinaryModule } from './helpers/cloudinary/cloudinary.module';
import { CommonModule } from './common/feature/feature.module';
import { Providers1Module } from './router/product/product.module';
import { ReviewModule } from './router/review/review.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    // connect to the Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'khan72242',
      database: 'gcomdatabase',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ProductsModules,
    CloudinaryModule,
    CommonModule,
    Providers1Module,
    ReviewModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
