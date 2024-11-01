import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/services/prisma.service';

@Injectable()
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

    if (!user) {
      return false;
    }

    // Get user permissions directly from database
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (!userWithRoles) {
      return false;
    }

    const userPermissions = new Set<string>();
    
    // Collect all permissions from user's roles
    for (const role of userWithRoles.roles) {
      for (const rolePermission of role.permissions) {
        userPermissions.add(rolePermission.permission.name);
      }
    }

    return requiredPermissions.every(permission => 
      userPermissions.has(permission)
    );
  }
}