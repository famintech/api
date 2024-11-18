import { Status, Priority } from '@prisma/client';

export class CreateMemorizationDto {
  target: string;
  scope: string;
  status?: Status;
  progress?: number;
  startTime: Date;
  duration: string;
  priority?: Priority;
}