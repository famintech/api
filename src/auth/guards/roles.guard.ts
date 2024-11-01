import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { PrismaService } from '../../../prisma/services/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      return false;
    }

    const userRoles = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!userRoles) {
      return false;
    }

    return requiredRoles.some(role => 
      userRoles.roles.some(userRole => userRole.name === role)
    );
  }
}