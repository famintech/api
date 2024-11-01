import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';

@Injectable()
export class PermissionCacheService {

  constructor(private prisma: PrismaService) {}

  async cacheUserPermissions(userId: string, permissions: string[]): Promise<void> {
    // const key = `user:${userId}:permissions`;
    // await this.redisService.del(key);
    // if (permissions.length > 0) {
    //   await this.redisService.sadd(key, ...permissions);
    // }
    // await this.redisService.expire(key, 3600);
    return;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    // const key = `user:${userId}:permissions`;
    // return this.redisService.smembers(key);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            permissions: {
              select: {
                permission: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return [];
    }

    const permissions = new Set<string>();
    
    for (const role of user.roles) {
      for (const rolePermission of role.permissions) {
        permissions.add(rolePermission.permission.name);
      }
    }

    return Array.from(permissions);
  }

  async invalidateUserPermissions(userId: string): Promise<void> {
    // const key = `user:${userId}:permissions`;
    // await this.redisService.del(key);
    return;
  }

  async invalidateRolePermissions(roleId: string): Promise<void> {
    // const userIds = await this.redisService.smembers(`role:${roleId}:users`);
    // for (const userId of userIds) {
    //   await this.invalidateUserPermissions(userId);
    // }
    return;
  }

  async getCachedUserPermissions(userId: string): Promise<string[]> {
    // const key = `user:${userId}:permissions`;
    // const cachedPermissions = await this.redisService.smembers(key);
    // return cachedPermissions;
    return this.getUserPermissions(userId);
  }
}