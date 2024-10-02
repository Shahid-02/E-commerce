import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { LoggerModule } from 'src/helpers/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/models/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), LoggerModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [],
})
export class AddressModule {}
