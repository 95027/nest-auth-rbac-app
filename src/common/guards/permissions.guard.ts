import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPerms) return true;

    const { user } = context.switchToHttp().getRequest();

    const userPerms = user?.permissions || [];

    const hasPerm = requiredPerms.every((per) => userPerms.includes(per));

    if (!hasPerm) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}
