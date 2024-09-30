import { Module } from '@nestjs/common';
import { CommonController } from './feature.controller';
import { CommonService } from './feature.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from 'src/models/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [],
})
export class CommonModule {}
