import { Module } from '@nestjs/common';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { PrismaService } from '../../prisma/services/prisma.service';
import { PermissionCacheService } from './services/permissions-cache.service';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/services/redis.service';

@Module({
  imports: [RedisModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, RedisService, PrismaService, PermissionCacheService],
  exports: [PermissionsService, PermissionCacheService],
})
export class PermissionsModule {}