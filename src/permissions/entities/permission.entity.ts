import { Role } from '../../roles/entities/role.entity';

export class Permission {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Role[];
}