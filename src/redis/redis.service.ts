import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: ClientProxy,
  ) {}

  async setValue(key: string, value: string): Promise<void> {
    this.logger.log(`Attempting to set key: ${key}`);
    try {
      await this.redisClient.send({ cmd: 'set' }, { key, value })
        .pipe(
          timeout(5000),
          catchError(error => {
            if (error instanceof TimeoutError) {
              this.logger.error(`Timeout while setting key: ${key}`);
            } else {
              this.logger.error(`Error setting key: ${key}`, error.stack);
            }
            return throwError(error);
          })
        )
        .toPromise();
      this.logger.log(`Successfully set key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set key: ${key}`, error.stack);
      throw error;
    }
  }

  async getValue(key: string): Promise<string | null> {
    this.logger.log(`Attempting to get key: ${key}`);
    try {
      const value = await this.redisClient.send({ cmd: 'get' }, key)
        .pipe(
          timeout(5000),
          catchError(error => {
            if (error instanceof TimeoutError) {
              this.logger.error(`Timeout while getting key: ${key}`);
            } else {
              this.logger.error(`Error getting key: ${key}`, error.stack);
            }
            return throwError(error);
          })
        )
        .toPromise();
      this.logger.log(`Successfully got key: ${key}, value: ${value}`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get key: ${key}`, error.stack);
      throw error;
    }
  }
}