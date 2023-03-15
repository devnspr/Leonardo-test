import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jwt-simple';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(
    req: Request & { user: string },
    res: Response,
    next: NextFunction,
  ) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = decode(token, process.env.JWT_SECRET);
      if (!decoded.hasOwnProperty('username')) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }
      req.user = decoded.username;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
