import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller'
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { PermissionCacheService } from '../permissions/services/permissions-cache.service';

@Module({
  imports: [PrismaModule],
  providers: [RolesService, PrismaService, PermissionCacheService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}