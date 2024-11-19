import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreateMemorizationDto } from '../dto/create-memorization.dto';
import { Priority, Status } from '@prisma/client';
import { UpdateMemorizationDto } from '../dto/update-memorization.dto';

@Injectable()
export class MemorizationService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateMemorizationDto) {
        try {
            const now = new Date(
                new Date().toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Kuala_Lumpur'
                })
            );

            return await this.prisma.memorization.create({
                data: {
                    target: data.target,
                    scope: data.scope,
                    status: data.status || Status.PENDING,
                    priority: data.priority || Priority.MEDIUM,
                    startTime: now,
                    progress: 0,
                    createdAt: now,
                    updatedAt: now,
                },
            });
        } catch (error) {
            console.error('Error creating memorization:', error);
            throw error;
        }
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