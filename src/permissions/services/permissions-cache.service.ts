import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class PermissionCacheService {

  constructor(private redisService: RedisService) {}

  async cacheUserPermissions(userId: string, permissions: string[]): Promise<void> {
    const key = `user:${userId}:permissions`;
    await this.redisService.del(key);
    if (permissions.length > 0) {
      await this.redisService.sadd(key, ...permissions);
    }
    await this.redisService.expire(key, 3600);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const key = `user:${userId}:permissions`;
    return this.redisService.smembers(key);
  }

  async invalidateUserPermissions(userId: string): Promise<void> {
    const key = `user:${userId}:permissions`;
    await this.redisService.del(key);
  }

  async invalidateRolePermissions(roleId: string): Promise<void> {
    const userIds = await this.redisService.smembers(`role:${roleId}:users`);
    for (const userId of userIds) {
      await this.invalidateUserPermissions(userId);
    }
  }
}