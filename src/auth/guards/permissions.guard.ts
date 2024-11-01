import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/services/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      return false;
    }

    // Get user's roles and their permissions
    const userRoles = await this.prisma.role.findMany({
      where: {
        users: {
          some: {
            id: user.userId
          }
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    const userPermissions = new Set<string>();
    
    for (const role of userRoles) {
      for (const rolePermission of role.permissions) {
        userPermissions.add(rolePermission.permission.name);
      }
    }

    return requiredPermissions.every(permission => 
      userPermissions.has(permission)
    );
  }
}