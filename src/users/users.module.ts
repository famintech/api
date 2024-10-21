import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/services/roles.service';

@Module({
  imports: [RolesModule],
  providers: [UsersService, RolesService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}