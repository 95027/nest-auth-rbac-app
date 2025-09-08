import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    const token = req.cookies['token'];
    if (!token) throw new UnauthorizedException('No Token Provided');

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
      req['user'] = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
