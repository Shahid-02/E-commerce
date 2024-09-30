import { IsInt, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ReviewDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  reviewMessage: string;

  @IsNumber()
  @IsNotEmpty()
  reviewValue: number;
}
