import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/models/cart.entity';
import { Product } from 'src/models/product.entity';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(cartDto: CartDto) {
    // try {
    //   const { userId, productId, quantity } = cartDto;
    //   if (!userId || !productId || quantity <= 0) {
    //     return {
    //       success: false,
    //       message: 'Invalid data provided!',
    //     };
    //   }
    //   const product = await this.productRepository.findOne({
    //     where: { id: productId },
    //   });
    //   if (!product) {
    //     return {
    //       success: false,
    //       message: 'Product not found!',
    //     };
    //   }
    //   let cart = await this.cartRepository.findOne({
    //     where: { id: userId },
    //     relations: ['items'],
    //   });
    //   if (!cart) {
    //     cart = this.cartRepository.create({ userId, items: [] });
    //   }
    //   const findCurrentProductIndex = cart.items.findIndex(
    //     (item) => item.productId === productId,
    //   );
    //   if (findCurrentProductIndex === -1) {
    //     cart.items.push({ productId, quantity });
    //   } else {
    //     cart.items[findCurrentProductIndex].quantity += quantity;
    //   }
    //   await this.cartRepository.save(cart);
    //   return {
    //     success: true,
    //     data: cart,
    //   };
    // } catch (error) {
    //   console.error(error);
    //   return {
    //     success: false,
    //     message: 'Error occurred while adding to cart',
    //   };
    // }
  }
}
