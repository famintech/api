import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: createRoleDto,
    });
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
}