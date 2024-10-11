import { Repository } from 'typeorm';
import { AddressDto } from './dto/address.dto';
import { Address } from 'src/models/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomLogger } from 'src/helpers/logger/custom-logger.service';

export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly logger: CustomLogger,
  ) {}

  async addAddress(addressDto: AddressDto) {
    try {
      const newlyCreatedAddress = this.addressRepository.create(addressDto);

      console.log(newlyCreatedAddress, 'gejrbgwelbvkerbv vwbfv');

      await this.addressRepository.save(newlyCreatedAddress);
      this.logger.log('Address added successfully');

      return newlyCreatedAddress;
    } catch (error) {
      this.logger.error('Error adding address', error);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  async getAllAddress(userId: number) {
    try {
      if (!userId) {
        this.logger.warn('User id is required');
        return {
          success: false,
          message: 'User id is required!',
        };
      }

      const addressList = await this.addressRepository.findOne({
        where: { userId },
      });

      console.log(addressList, 'herere');

      if (!addressList) {
        this.logger.warn('No addresses found for the user');
        return {
          success: false,
          message: 'No addresses found for the user!',
        };
      }

      this.logger.log('Addresses retrieved successfully');

      return addressList;
    } catch (error) {
      this.logger.error('Error retrieving addresses', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAddress(userId: number, addressId: number) {
    try {
      if (!userId || !addressId) {
        return {
          success: false,
          message: 'User and address id is required!',
        };
      }

      const addressToDelete = await this.addressRepository.findOne({
        where: { id: addressId, userId },
      });

      if (!addressToDelete) {
        return {
          success: false,
          message: 'Address not found!',
        };
      }

      const data = await this.addressRepository.remove(addressToDelete);
      this.logger.log('Address deleted successfully');
      return data;
    } catch (error) {
      this.logger.error('Error deleting address', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editAddress(
    userId: number,
    addressId: number,
    updatedAddress: AddressDto,
  ) {
    try {
      this.logger.log(
        `Editing address for user ${userId} and address ${addressId}`,
      );

      if (!userId || !addressId) {
        this.logger.warn('User id or address id is missing');
        return {
          success: false,
          message: 'User and address id are required!',
        };
      }

      const addressToUpdate = await this.addressRepository.findOne({
        where: { id: addressId, userId },
      });

      if (!addressToUpdate) {
        this.logger.warn(
          `Address not found for user ${userId} and address ${addressId}`,
        );
        return {
          success: false,
          message: 'Address not found!',
        };
      }

      this.logger.log(
        `Updating address for user ${userId} and address ${addressId}`,
      );

      const data = await this.addressRepository.update(
        { id: addressId },
        updatedAddress,
      );

      this.logger.log(
        `Address updated successfully for user ${userId} and address ${addressId}`,
      );
      return data;
    } catch (error) {
      this.logger.error('Error editing address', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
