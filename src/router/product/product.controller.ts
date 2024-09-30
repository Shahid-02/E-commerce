import { Controller, Get, Param, Query } from '@nestjs/common';
import { Providers1Service } from './product.service';
import { Any } from 'typeorm';

@Controller('/api/shop/products')
export class Providers1Controller {
  constructor(private readonly providers1Service: Providers1Service) {}

  @Get('/get')
  async getFilteredProducts(@Query() query: any) {
    return this.providers1Service.getFilteredProducts(query);
  }

  @Get('/get/:id')
  async getProductDetails(@Param('id') id: number) {
    return this.providers1Service.getProductDetails(id);
  }
}
