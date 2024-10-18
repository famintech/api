import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const redisService = app.get(RedisService);

  try {
    await redisService.setValue('health_check', 'ok');
    logger.log('Successfully connected to Redis');
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
  }

  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();