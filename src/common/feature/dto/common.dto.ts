import { IsString } from 'class-validator';

export class CommonDot {
  @IsString()
  image: string;
}
