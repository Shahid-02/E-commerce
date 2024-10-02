import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { Response } from 'express';

@Controller('/api/shop/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/add')
  async addAddress(@Body() addressDto: AddressDto, @Res() res: Response) {
    try {
      const data = await this.addressService.addAddress(addressDto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.response?.message || 'Error',
      });
    }
  }

  @Get('/get/:userId')
  async fetchAllAddress(@Param('userId') userId: number, @Res() res: Response) {
    try {
      const data = await this.addressService.getAllAddress(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.response?.message || 'Error',
      });
    }
  }

  @Delete('/delete/:userId/:addressId')
  async deleteAddress(
    @Param('userId') userId: number,
    @Param('addressId') addressId: number,
    @Res() res: Response,
  ) {
    try {
      const data = await this.addressService.deleteAddress(userId, addressId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Address deleted successfully',
        data,
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.response?.message || 'Error',
      });
    }
  }

  @Put('/update/:userId/:addressId')
  async updateAddress(
    @Param('userId') userId: number,
    @Param('addressId') addressId: number,
    @Body() addressDto: AddressDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.addressService.editAddress(
        userId,
        addressId,
        addressDto,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Address updated successfully',
        data,
      });
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.response?.message || 'Error',
      });
    }
  }
}
