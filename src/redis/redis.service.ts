import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: ClientProxy,
  ) {}

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.send({ cmd: 'set' }, { key, value }).toPromise();
  }

  async getValue(key: string): Promise<string | null> {
    return this.redisClient.send({ cmd: 'get' }, key).toPromise();
  }
}