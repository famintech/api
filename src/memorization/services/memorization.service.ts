import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/services/prisma.service';
import { CreateMemorizationDto } from '../dto/create-memorization.dto';
import { Priority, Status, Memorization } from '@prisma/client';
import { UpdateMemorizationDto } from '../dto/update-memorization.dto';

@Injectable()
export class MemorizationService {
    private static readonly TIMEZONE = 'Asia/Kuala_Lumpur';
    
    constructor(private prisma: PrismaService) {}

    private formatDateTime(date: Date): string {
        const formatted = date.toLocaleString('en-GB', {
            timeZone: MemorizationService.TIMEZONE,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // Add milliseconds
        const ms = date.getMilliseconds().toString().padStart(3, '0');
        return `${formatted}.${ms}`;
    }

    private parseFormattedDate(dateString: string): Date {
        // Convert "DD/MM/YYYY, HH:mm:ss.SSS" to Date object
        const [datePart, timePart] = dateString.split(', ');
        const [day, month, year] = datePart.split('/');
        const [time, ms] = timePart.split('.');
        const [hour, minute, second] = time.split(':');
        
        return new Date(
            Date.UTC(
                +year,
                +month - 1, // months are 0-based
                +day,
                +hour - 8, // adjust for UTC+8
                +minute,
                +second,
                +ms
            )
        );
    }

    private createFormattedDateNow(): string {
        const now = new Date(
            new Date().toLocaleString('en-GB', {
                timeZone: MemorizationService.TIMEZONE
            })
        );
        return this.formatDateTime(now);
    }

    private formatResponse(data: Memorization) {
        return {
            ...data,
            startTime: this.formatDateTime(data.startTime),
            createdAt: this.formatDateTime(data.createdAt),
            updatedAt: this.formatDateTime(data.updatedAt)
        };
    }

    async create(data: CreateMemorizationDto) {
        try {
            const now = this.createFormattedDateNow();
            
            const result = await this.prisma.memorization.create({
                data: {
                    ...data,
                    startTime: this.parseFormattedDate(now),
                    status: data.status || Status.PENDING,
                    priority: data.priority || Priority.MEDIUM,
                    progress: 0
                },
            });

            return this.formatResponse(result);
        } catch (error) {
            console.error('Error creating memorization:', error);
            throw error;
        }
    }

    // Add this to other methods as well
    async findAll() {
        const results = await this.prisma.memorization.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return results.map(result => this.formatResponse(result));
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
            const result = await this.prisma.memorization.update({
                where: { id },
                data: {
                    progress,
                    status: progress === 100 ? Status.COMPLETED : Status.IN_PROGRESS,
                    updatedAt: this.parseFormattedDate(this.createFormattedDateNow())
                },
            });
            return this.formatResponse(result);
        } catch (error) {
            console.error('Error updating progress:', error);
            throw error;
        }
    }
}