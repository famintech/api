import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from './redis.service';
import { RedisController } from './controllers/redis.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RedisService],
  exports: [RedisService],
  controllers: [RedisController], 
})
export class RedisModule {}