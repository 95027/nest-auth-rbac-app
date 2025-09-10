import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // skip guard
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromReq(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });
      request['user'] = payload; // attach user info to request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromReq(request: Request): string | null {
    // Check header first
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // Check cookies
    if (request.cookies && request.cookies['token']) {
      return request.cookies['token'];
    }

    return null;
  }
}
