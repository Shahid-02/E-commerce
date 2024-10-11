import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CustomLogger } from 'src/helpers/logger/custom-logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
    private logger: CustomLogger,
  ) {}

  async Register(registerUserDto: RegisterUserDto) {
    try {
      this.logger.log(
        `Attempting to register user with email: ${registerUserDto.email}`,
      );

      const user = await this.authRepository.findOne({
        where: { email: registerUserDto.email },
      });

      if (user) {
        this.logger.warn(
          `User with email ${registerUserDto.email} already exists`,
        );
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
          this.logger.log(
            `User with email ${registerUserDto.email} registered successfully`,
          );
          return {
            success: true,
            message: 'Registration successful',
          };
        } else {
          this.logger.error(
            `Failed to create user with email: ${registerUserDto.email}`,
          );
          throw new HttpException(
            'Failed to create user',
            HttpStatus.BAD_GATEWAY,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error during registration for email: ${registerUserDto.email}`,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      this.logger.log(
        `Attempting login for user with email: ${loginUserDto.email}`,
      );

      const user = await this.authRepository.findOne({
        where: { email: loginUserDto.email },
      });

      if (user) {
        const isMatch = await bcrypt.compare(
          loginUserDto.password,
          user.password,
        );

        if (isMatch) {
          this.logger.log(
            `User with email ${loginUserDto.email} logged in successfully`,
          );

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
          this.logger.warn(
            `Password mismatch for user with email: ${loginUserDto.email}`,
          );
          throw new HttpException(
            'Password is incorrect',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        this.logger.warn(`User with email ${loginUserDto.email} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.logger.error(
        `Error during login for email: ${loginUserDto.email}`,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(@Res() res: Response) {
    try {
      this.logger.log('User logging out, clearing token');
      // Clear the JWT cookie
      res.clearCookie('token');
      return res.json({
        success: true,
        message: 'Logged out successfully!',
      });
    } catch (error) {
      this.logger.error('Error during logout', error.stack);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
