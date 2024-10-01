import { IsNumber, IsString } from 'class-validator';

export class AddressDto {
  @IsNumber()
  userId: number;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  pincode: string;
  @IsString()
  phone: string;
  @IsString()
  notes: string;
}
