import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';

export class Role {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  permissions: Permission[];
}