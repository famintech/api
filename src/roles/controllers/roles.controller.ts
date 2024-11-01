import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Roles } from '../../auth/decorators/roles.decorators';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post() 
  @Roles('superadmin')
  @Permissions('create:role')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':roleId/users/:userId')
  addUserToRole(@Param('roleId') roleId: string, @Param('userId') userId: string) {
    return this.rolesService.addUserToRole(userId, roleId);
  }

  @Delete(':roleId/users/:userId')
  removeUserFromRole(@Param('roleId') roleId: string, @Param('userId') userId: string) {
    return this.rolesService.removeUserFromRole(userId, roleId);
  }

  @Post(':roleId/permissions/:permissionId')
  addPermissionToRole(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.addPermissionToRole(permissionId, roleId);
  }

  @Delete(':roleId/permissions/:permissionId')
  removePermissionFromRole(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePermissionFromRole(permissionId, roleId);
  }

  @Get(':id/inherited-permissions')
  getInheritedPermissions(@Param('id') id: string) {
    return this.rolesService.getInheritedPermissions(id);
  }

  @Post(':roleId/parent/:parentRoleId')
  setParentRole(@Param('roleId') roleId: string, @Param('parentRoleId') parentRoleId: string) {
    return this.rolesService.setParentRole(roleId, parentRoleId);
  }

  @Delete(':roleId/parent')
  removeParentRole(@Param('roleId') roleId: string) {
    return this.rolesService.removeParentRole(roleId);
  }
}