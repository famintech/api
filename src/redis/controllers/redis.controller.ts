import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RedisService } from '../services/redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post()
  async setValue(@Body() body: { key: string; value: string }) {
    await this.redisService.setValue(body.key, body.value);
    return { message: 'Value set successfully' };
  }

  @Get(':key')
  async getValue(@Param('key') key: string) {
    const value = await this.redisService.getValue(key);
    return { key, value };
  }
}