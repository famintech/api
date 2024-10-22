import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionCacheService } from '../../permissions/services/permissions-cache.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionCacheService: PermissionCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    const userPermissions = await this.permissionCacheService.getCachedUserPermissions(userId);

    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }
}