import { Injectable } from '@nestjs/common';
import { PermissionUpdatesGateway } from '../gateway/permission-updates.gateway';
import { PermissionCacheService } from '../../permissions/services/permissions-cache.service';

@Injectable()
export class PermissionUpdatesService {
  constructor(
    private readonly permissionUpdatesGateway: PermissionUpdatesGateway,
    private readonly permissionCacheService: PermissionCacheService,
  ) {}

  async notifyPermissionChange(userId: string) {
    const permissions = await this.permissionCacheService.getUserPermissions(userId);
    await this.permissionUpdatesGateway.emitPermissionUpdate(userId, permissions);
  }

  async notifyRolePermissionChange(roleId: string) {
    await this.permissionUpdatesGateway.emitRolePermissionUpdate(roleId);
  }
}