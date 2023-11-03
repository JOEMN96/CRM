import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY, Role } from './roles.decorator';
import { Payload } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.access_token;
    let payload: Payload | undefined | null;
    try {
      payload = await new JwtService().verifyAsync(accessToken, {
        secret: process.env.ACCESSTOKENSECRET,
      });
    } catch (error) {
      return false;
    }

    return requiredRoles.some((role) => payload.role == role);
  }
}
