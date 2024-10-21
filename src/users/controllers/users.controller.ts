import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { RolesService } from '../../roles/services/roles.service';
import { PermissionCacheService } from '../../permissions/services/permissions-cache.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionCacheService: PermissionCacheService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User registered successfully', userId: user.id };
  }

  @Get(':id/permissions')
  async getUserPermissions(@Param('id') id: string) {
    const cachedPermissions = await this.permissionCacheService.getUserPermissions(id);
    if (cachedPermissions.length > 0) {
      return cachedPermissions;
    }

    const permissions = await this.rolesService.getUserPermissions(id);
    await this.permissionCacheService.cacheUserPermissions(id, permissions);
    return permissions;
  }

  @Get(':id/cached-permissions')
  async getCachedUserPermissions(@Param('id') id: string) {
    return this.permissionCacheService.getCachedUserPermissions(id);
  }

  // @Get(':id/permissions')
  // async getUserPermissions(@Param('id') id: string) {
  //   const permissions = await this.rolesService.getUserPermissions(id);
  //   await this.permissionCacheService.cacheUserPermissions(id, permissions);
  //   return permissions;
  // }
}