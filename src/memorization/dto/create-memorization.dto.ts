import { Status, Priority } from '@prisma/client';

export class CreateMemorizationDto {
  target: string;
  scope: string;
  status?: Status;
  priority?: Priority;
}