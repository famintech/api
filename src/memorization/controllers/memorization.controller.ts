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
  
  @Controller('memorization')
  export class MemorizationController {
    constructor(private readonly memorizationService: MemorizationService) {}
  
    @Post()
    async create(@Body() createMemorizationDto: CreateMemorizationDto) {
      try {
        return await this.memorizationService.create(createMemorizationDto);
      } catch (error) {
        throw new HttpException(
          'Failed to create memorization',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    @Get()
    async findAll() {
      try {
        return await this.memorizationService.findAll();
      } catch (error) {
        throw new HttpException(
          'Failed to fetch memorizations',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
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
          'Failed to fetch memorization',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateMemorizationDto: UpdateMemorizationDto,
    ) {
      try {
        return await this.memorizationService.update(id, updateMemorizationDto);
      } catch (error) {
        throw new HttpException(
          'Failed to update memorization',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      try {
        return await this.memorizationService.remove(id);
      } catch (error) {
        throw new HttpException(
          'Failed to delete memorization',
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
          'Failed to update progress',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }