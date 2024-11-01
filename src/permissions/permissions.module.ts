import { Module } from '@nestjs/common';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { PrismaService } from '../../prisma/services/prisma.service';
import { PermissionCacheService } from './services/permissions-cache.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, PermissionCacheService, PermissionsGuard],
  exports: [PermissionsService, PermissionCacheService, PermissionsGuard],
})
export class PermissionsModule {}