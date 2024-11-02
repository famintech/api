import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  namespace: 'permissions'
})
export class PermissionUpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });

      const userId = payload.sub;
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId).add(client.id);

      // Join user-specific room
      client.join(`user:${userId}`);
      
      // Join role-specific rooms based on user's roles
      const userRoles = await this.getUserRoles(userId);
      userRoles.forEach(role => {
        client.join(`role:${role.id}`);
      });

    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  private async getUserRoles(userId: string) {
    // Implement this method to fetch user roles from your database
    return [];
  }

  // Methods to emit updates
  async emitPermissionUpdate(userId: string, permissions: string[]) {
    this.server.to(`user:${userId}`).emit('permissionUpdate', { permissions });
  }

  async emitRolePermissionUpdate(roleId: string) {
    this.server.to(`role:${roleId}`).emit('rolePermissionUpdate', { roleId });
  }
}