import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionUpdatesGateway } from './gateway/permission-updates.gateway';
import { PermissionUpdatesService } from './services/permission-updates.service';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    PermissionsModule
  ],
  providers: [PermissionUpdatesGateway, PermissionUpdatesService],
  exports: [PermissionUpdatesService],
})
export class WebsocketModule {}