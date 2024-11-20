import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { MemorizationService } from '../services/memorization.service';
import { CreateMemorizationDto } from '../dto/create-memorization.dto';
import { UpdateMemorizationDto } from '../dto/update-memorization.dto';
import { UpdateItemProgressDto } from '../dto/update-item-progress.dto';
import { AddMemorizationItemDto } from '../dto/add-memorization-item.dto';

@Controller('memorization')
export class MemorizationController {
    constructor(private readonly memorizationService: MemorizationService) { }

    // Keep existing endpoints (referenced from lines 20-121)
    @Post()
    async create(@Body() createMemorizationDto: CreateMemorizationDto) {
        try {
            return await this.memorizationService.create(createMemorizationDto);
        } catch (error) {
            const errorMessage = error.message
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Failed to create memorization : ${errorMessage}`,
                    error: 'Bad Request'
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get()
    async findAll() {
        try {
            return await this.memorizationService.findAll();
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to fetch memorizations',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Add new endpoint for updating item progress
    @Patch('items/:itemId/progress')
    async updateItemProgress(
        @Param('itemId') itemId: string,
        @Body() updateItemProgressDto: UpdateItemProgressDto
    ) {
        try {
            return await this.memorizationService.updateItemProgress(itemId, updateItemProgressDto);
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to update item progress',
                    error: error.message
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Keep other existing endpoints but update findOne to include items
    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const memorization = await this.memorizationService.findOne(id);
            if (!memorization) {
                throw new HttpException('Memorization not found', HttpStatus.NOT_FOUND);
            }
            return memorization;
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to fetch memorization',
                    error: error.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Keep remaining existing endpoints
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateMemorizationDto: UpdateMemorizationDto,
    ) {
        try {
            return await this.memorizationService.update(id, updateMemorizationDto);
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to update memorization',
                    error: error.message
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            return await this.memorizationService.delete(id);
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to delete memorization',
                    error: error.message
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Patch(':id/progress')
    async updateProgress(
        @Param('id') id: string,
        @Body('progress') progress: number,
    ) {
        try {
            if (progress < 0 || progress > 100) {
                throw new HttpException(
                    'Progress must be between 0 and 100',
                    HttpStatus.BAD_REQUEST,
                );
            }
            return await this.memorizationService.updateProgress(id, progress);
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to update progress',
                    error: error.message
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post(':id/items')
    async addItem(
        @Param('id') id: string,
        @Body() addItemDto: AddMemorizationItemDto
    ) {
        try {
            return await this.memorizationService.addItem(id, addItemDto);
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to add item',
                    error: error.message
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}