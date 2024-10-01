import { Repository } from 'typeorm';
import { AddressDto } from './dto/address.dto';
import { Address } from 'src/models/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async addAddress(addressDto: AddressDto) {
    try {
      //   const newlyCreatedAddress = this.addressRepository.create(addressDto);
      //   await this.addressRepository.save(newlyCreatedAddress);
    } catch (error) {
      console.log(error.massage);
      throw new HttpException(error.massage, HttpStatus.BAD_GATEWAY);
    }
  }
}
