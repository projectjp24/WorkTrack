import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

     // Support both single role and multiple roles
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles: string[] = Array.isArray(user?.roles)
      ? user.roles
      : user?.role_name ? [user.role_name] : []; // fallback to single role from JWT

    // Allow if any required role matches
    return requiredRoles.some(role => userRoles.includes(role));
  }
}

