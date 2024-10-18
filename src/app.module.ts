import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PrismaService } from '../prisma/services/prisma.service';
import { RedisModule } from './redis/redis.module';
import configuration from './config/configuration';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
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
    WebsocketModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}