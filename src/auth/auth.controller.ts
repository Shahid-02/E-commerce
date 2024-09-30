import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { Response } from 'express';
import { MiddlewareService } from 'src/helpers/middlerware/middlerware.service';

export interface RequestWithUser extends Request {
  user?: any;
}

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.Register(registerUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('/check-auth')
  @UseGuards(MiddlewareService)
  async user(@Req() req: RequestWithUser) {
    try {
      const user = req.user;
      return {
        success: true,
        message: 'Authenticated user!',
        user,
      };
    } catch (error) {
      console.log(error.massage);
    }
  }
}
