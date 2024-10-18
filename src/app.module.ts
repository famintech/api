import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus'
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    TerminusModule,
    RedisHealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    HealthModule,
  ],
})
export class AppModule {}