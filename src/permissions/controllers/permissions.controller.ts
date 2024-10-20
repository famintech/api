import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('permissions')
@UseGuards(AuthGuard('jwt'))
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post(':permissionId/roles/:roleId')
  addPermissionToRole(@Param('permissionId') permissionId: string, @Param('roleId') roleId: string) {
    return this.permissionsService.addPermissionToRole(permissionId, roleId);
  }

  @Delete(':permissionId/roles/:roleId')
  removePermissionFromRole(@Param('permissionId') permissionId: string, @Param('roleId') roleId: string) {
    return this.permissionsService.removePermissionFromRole(permissionId, roleId);
  }
}