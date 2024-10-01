import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('/api/shop/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/:keyword')
  async searchProducts(@Param('keyword') keyword: string) {
    return this.searchService.searchProducts(keyword);
  }
}
