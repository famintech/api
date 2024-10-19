import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      return await this.prisma.permission.update({
        where: { id },
        data: updatePermissionDto,
      });
    } catch (error) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.permission.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
  }

  async addPermissionToRole(permissionId: string, roleId: string) {
    try {
      return await this.prisma.permission.update({
        where: { id: permissionId },
        data: {
          roles: {
            connect: { id: roleId },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Permission or Role not found');
    }
  }

  async removePermissionFromRole(permissionId: string, roleId: string) {
    try {
      return await this.prisma.permission.update({
        where: { id: permissionId },
        data: {
          roles: {
            disconnect: { id: roleId },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Permission or Role not found');
    }
  }
}