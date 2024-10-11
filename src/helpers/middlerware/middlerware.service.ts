import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class MiddlewareService implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('Unauthorized user!');
    }

    try {
      const decoded = jwt.verify(token, 'snlavnkwevnowe');
      console.log(decoded, 'here');

      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized user!');
    }
  }
}
