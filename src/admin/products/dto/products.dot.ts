import {
  IsString,
  IsNumber,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDecimal()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsDecimal()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
