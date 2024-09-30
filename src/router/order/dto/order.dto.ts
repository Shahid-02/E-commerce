import { IsArray, IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class OrderDto {
  @IsString()
  userId: string;

  @IsArray()
  cartItems: any[];

  @IsObject()
  addressInfo: any;

  @IsString()
  orderStatus: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  paymentStatus: string;

  @IsNumber()
  totalAmount: number;

  @IsDate()
  orderDate: Date;

  @IsDate()
  orderUpdateDate: Date;

  @IsString()
  paymentId: string;

  @IsString()
  payerId: string;

  @IsString()
  cartId: string;
}
