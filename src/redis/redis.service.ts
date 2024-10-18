import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error(`Redis connection failed after ${times} attempts`);
          return null; // stop retrying
        }
        return Math.min(times * 1000, 3000); // wait for 1s, 2s, 3s
      },
    });

    this.redisClient.on('error', (error) => {
      this.logger.error('Redis connection error', error);
    });

    this.redisClient.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
    });
  }

  async setValue(key: string, value: string): Promise<void> {
    this.logger.log(`Attempting to set key: ${key}`);
    try {
      await this.redisClient.set(key, value);
      this.logger.log(`Successfully set key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set key: ${key}`, error.stack);
      throw error;
    }
  }

  async getValue(key: string): Promise<string | null> {
    this.logger.log(`Attempting to get key: ${key}`);
    try {
      const value = await this.redisClient.get(key);
      this.logger.log(`Successfully got key: ${key}, value: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get key: ${key}`, error.stack);
      throw error;
    }
  }
}