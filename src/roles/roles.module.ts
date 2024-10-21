import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller'
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/services/prisma.service';
import { PermissionCacheService } from '../permissions/services/permissions-cache.service';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/services/redis.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [RolesService, RedisService, PrismaService, PermissionCacheService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}