import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';

@Controller('/api/shop/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async addToCart(@Body() cartDto: CartDto) {
    return this.cartService.addToCart(cartDto);
  }
}
