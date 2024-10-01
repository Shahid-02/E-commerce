import { Body, Controller, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';

@Controller('/api/shop/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/add')
  async addAddress(@Body() addressDto: AddressDto) {
    return await this.addressService.addAddress(addressDto);
  }
}
