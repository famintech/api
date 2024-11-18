import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Status, Priority } from '@prisma/client';

export class CreateMemorizationDto {
  @IsString()
  @IsNotEmpty()
  target: string;

  @IsString()
  @IsNotEmpty()
  scope: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}