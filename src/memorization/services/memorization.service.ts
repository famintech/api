import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreateMemorizationDto, Status } from '../dto/create-memorization.dto';
import { UpdateMemorizationDto } from '../dto/update-memorization.dto';

@Injectable()
export class MemorizationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMemorizationDto) {
    return this.prisma.memorization.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.memorization.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.memorization.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateMemorizationDto) {
    return this.prisma.memorization.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.memorization.delete({
      where: { id },
    });
  }

  async updateProgress(id: string, progress: number) {
    return this.prisma.memorization.update({
      where: { id },
      data: {
        progress,
        status: progress === 100 ? Status.COMPLETED : Status.IN_PROGRESS,
      },
    });
  }
}