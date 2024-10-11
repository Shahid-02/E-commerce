import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/helpers/cloudinary/cloudinary.service';
import { ProductDto } from './dto/products.dot';

@Controller('/api/admin/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('/add')
  addProducts(@Body() productDto: ProductDto) {
    return this.productsService.addProducts(productDto);
  }

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('my_file'))
  async uploadFile(
    @UploadedFile() // new ParseFilePipe({
    //     new MaxFileSizeValidator({ maxSize: 80 * 1024 }),
    file //   validators: [
    //   ],
    // }),
    : Express.Multer.File,
  ) {
    // console.log(file);

    if (!file) {
      return { message: 'File upload failed' };
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file.buffer,
        'my_file',
      );

      console.log(result);

      return {
        success: true,
        data: {
          result,
        },
      };
    } catch (error) {
      return {
        message: 'File upload failed',
        error: error.message,
      };
    }
  }

  @Get('/get')
  async getAllProducts() {
    return this.productsService.fetchAllProducts();
  }

  @Put('/edit/:id')
  async editProduct(@Param('id') id: number, @Body() productDto: ProductDto) {
    return this.productsService.editProduct(id, productDto);
  }

  @Delete('/delete/:id')
  async deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
