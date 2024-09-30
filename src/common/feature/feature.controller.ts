import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommonService } from './feature.service';
import { CommonDot } from './dto/common.dto';

@Controller('/api/common/feature')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/add')
  async addFeature(@Body() commonDot: CommonDot) {
    return await this.commonService.addFeature(commonDot);
  }

  @Get('/get')
  async getAllFeatures() {
    return await this.commonService.getAllFeatures();
  }
}
