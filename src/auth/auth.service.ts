import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express'; // Ensure Response is imported from 'express'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async Register(registerUserDto: RegisterUserDto) {
    try {
      const user = await this.authRepository.findOne({
        where: { email: registerUserDto.email },
      });

      if (user) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      } else {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
        const newUser = this.authRepository.create({
          userName: registerUserDto.userName,
          email: registerUserDto.email,
          password: hashedPassword,
        });

        if (newUser) {
          await this.authRepository.save(newUser);
          return {
            success: true,
            message: 'Registration successful',
          };
        } else {
          throw new HttpException(
            'Failed to create user',
            HttpStatus.BAD_GATEWAY,
          );
        }
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const user = await this.authRepository.findOne({
        where: { email: loginUserDto.email },
      });

      if (user) {
        const isMatch = await bcrypt.compare(
          loginUserDto.password,
          user.password,
        );

        if (isMatch) {
          const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
          const token = this.jwtService.sign(payload);

          // Set the JWT as a cookie
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600 * 1000, // 1 hour
          });

          return res.json({
            success: true,
            message: 'User logged in successfully',
            data: {
              user,
            },
          });
        } else {
          throw new HttpException(
            'Password is incorrect',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(@Res() res: Response) {
    try {
      // Clear the JWT cookie
      res.clearCookie('token'); // Make sure you are using Express
      return res.json({
        success: true,
        message: 'Logged out successfully!',
      });
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
