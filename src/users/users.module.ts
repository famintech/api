import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/services/roles.service';
import { PermissionCacheService } from '../permissions/services/permissions-cache.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/services/redis.service';

@Module({
  imports: [RolesModule, PermissionsModule, RedisModule],
  providers: [UsersService, RolesService, PermissionCacheService, RedisService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}