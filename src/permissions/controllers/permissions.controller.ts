import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions('create:permission')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permissions('read:permission')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Permissions('read:permission')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update:permission')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions('delete:permission')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post(':permissionId/roles/:roleId')
  @Permissions('assign:permission')
  addPermissionToRole(@Param('permissionId') permissionId: string, @Param('roleId') roleId: string) {
    return this.permissionsService.addPermissionToRole(permissionId, roleId);
  }

  @Delete(':permissionId/roles/:roleId')
  @Permissions('unassign:permission')
  removePermissionFromRole(@Param('permissionId') permissionId: string, @Param('roleId') roleId: string) {
    return this.permissionsService.removePermissionFromRole(permissionId, roleId);
  }
}