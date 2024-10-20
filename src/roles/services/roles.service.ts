import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.prisma.role.create({
        data: createRoleDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Role with name "${createRoleDto.name}" already exists`);
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      return await this.prisma.role.update({
        where: { id },
        data: updateRoleDto,
      });
    } catch (error) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.role.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
  }

  async addUserToRole(userId: string, roleId: string) {
    try {
      return await this.prisma.role.update({
        where: { id: roleId },
        data: {
          users: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('User or Role not found');
    }
  }

  async removeUserFromRole(userId: string, roleId: string) {
    try {
      return await this.prisma.role.update({
        where: { id: roleId },
        data: {
          users: {
            disconnect: { id: userId },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('User or Role not found');
    }
  }

  async addPermissionToRole(permissionId: string, roleId: string) {
    try {
      return await this.prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Permission is already assigned to this role');
      }
      throw new NotFoundException('Permission or Role not found');
    }
  }

  async removePermissionFromRole(permissionId: string, roleId: string) {
    try {
      return await this.prisma.rolePermission.delete({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Permission is not assigned to this role');
    }
  }

  async getInheritedPermissions(roleId: string): Promise<string[]> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          select: { permissionId: true },
        },
        parentRole: true,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    const permissions = role.permissions.map((rp) => rp.permissionId);

    if (role.parentRole) {
      const parentPermissions = await this.getInheritedPermissions(role.parentRole.id);
      return [...new Set([...permissions, ...parentPermissions])];
    }

    return permissions;
  }

  async setParentRole(roleId: string, parentRoleId: string) {
    try {
      return await this.prisma.role.update({
        where: { id: roleId },
        data: { parentRoleId },
      });
    } catch (error) {
      throw new NotFoundException('Role or parent role not found');
    }
  }

  async removeParentRole(roleId: string) {
    try {
      return await this.prisma.role.update({
        where: { id: roleId },
        data: { parentRoleId: null },
      });
    } catch (error) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }
  }
}