// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import Redis from 'ioredis';

@Controller()
export class HealthController {
  private readonly redis: Redis;

  constructor(private readonly health: HealthCheckService, private readonly redisIndicator: RedisHealthIndicator) {
    this.redis = new Redis({ host: 'redis', port: 6379 });
  }

  @Get('health')
  @HealthCheck()
  async healthChecks(): Promise<HealthCheckResult> {
    return await this.health.check([
      () => this.redisIndicator.checkHealth('redis', { type: 'redis', client: this.redis, timeout: 500 })
    ]);
  }
}