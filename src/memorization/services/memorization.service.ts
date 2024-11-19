import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreateMemorizationDto } from '../dto/create-memorization.dto';
import { Priority, Status, Memorization } from '@prisma/client';
import { UpdateMemorizationDto } from '../dto/update-memorization.dto';

@Injectable()
export class MemorizationService {
    private static readonly TIMEZONE = 'Asia/Kuala_Lumpur';
    
    constructor(private prisma: PrismaService) {}

    private formatDateTime(date: Date | null): string | null {
        if (!date) return null;
        
        // Convert UTC to KL time for display
        const klDate = new Date(date.getTime());
        klDate.setHours(klDate.getHours() + 8); // KL is UTC+8
        
        return klDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }) + `.${klDate.getMilliseconds().toString().padStart(3, '0')}`;
    }

    private createDateInKLTimezone(): Date {
        const date = new Date();
        // Store as UTC but representing KL time
        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ));
    }

    private formatResponse(data: Memorization) {
        return {
            ...data,
            startTime: data.startTime ? this.formatDateTime(data.startTime) : null,
            createdAt: this.formatDateTime(data.createdAt),
            updatedAt: this.formatDateTime(data.updatedAt)
        };
    }

    async create(data: CreateMemorizationDto) {
        try {
            const currentTime = this.createDateInKLTimezone();
            const result = await this.prisma.memorization.create({
                data: {
                    ...data,
                    startTime: data.status === Status.IN_PROGRESS ? currentTime : null,
                    status: data.status || Status.PENDING,
                    priority: data.priority || Priority.MEDIUM,
                    progress: 0
                },
            });

            return {
                ...result,
                startTime: result.startTime ? this.formatDateTime(result.startTime) : null,
                createdAt: this.formatDateTime(result.createdAt),
                updatedAt: this.formatDateTime(result.updatedAt)
            };
        } catch (error) {
            console.error('Error creating memorization:', error);
            throw error;
        }
    }

    // Add this to other methods as well
    async findAll() {
        try {
            const results = await this.prisma.memorization.findMany({
                orderBy: { createdAt: 'desc' },
            });
            
            // Explicitly handle null startTime in the response
            return results.map(result => ({
                ...result,
                startTime: result.startTime ? this.formatDateTime(result.startTime) : null,
                createdAt: this.formatDateTime(result.createdAt),
                updatedAt: this.formatDateTime(result.updatedAt)
            }));
        } catch (error) {
            console.error('Error fetching memorizations:', error);
            throw error;
        }
    }

    async findOne(id: string) {
        const result = await this.prisma.memorization.findUnique({
            where: { id },
        });
        return result ? this.formatResponse(result) : null;
    }

    async update(id: string, data: UpdateMemorizationDto) {
        const result = await this.prisma.memorization.update({
            where: { id },
            data,
        });
        return this.formatResponse(result);
    }

    async delete(id: string) {
        try {
            const result = await this.prisma.memorization.delete({
                where: { id },
            });
            return this.formatResponse(result);
        } catch (error) {
            console.error('Error deleting memorization:', error);
            throw error;
        }
    }

    async updateProgress(id: string, progress: number) {
        try {
            const currentTime = this.createDateInKLTimezone();
            const memorization = await this.prisma.memorization.findUnique({
                where: { id }
            });
    
            // Only set startTime if it's null and the status is changing to IN_PROGRESS
            const startTime = memorization.startTime || 
                (progress > 0 && progress < 100 ? currentTime : null);
    
            const result = await this.prisma.memorization.update({
                where: { id },
                data: {
                    progress,
                    status: progress === 100 ? Status.COMPLETED : Status.IN_PROGRESS,
                    startTime, // This will keep existing startTime if it exists
                    updatedAt: currentTime
                },
            });
    
            return {
                ...result,
                startTime: result.startTime ? this.formatDateTime(result.startTime) : null,
                createdAt: this.formatDateTime(result.createdAt),
                updatedAt: this.formatDateTime(result.updatedAt)
            };
        } catch (error) {
            console.error('Error updating progress:', error);
            throw error;
        }
    }
}