import { Module } from '@nestjs/common';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { PrismaService } from '../../prisma/services/prisma.service';
import { PermissionCacheService } from './services/permissions-cache.service';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, PermissionCacheService],
  exports: [PermissionsService, PermissionCacheService],
})
export class PermissionsModule {}