import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Status, Priority } from '@prisma/client';
import { CreateMemorizationItemDto } from './create-memorization-item.dto';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMemorizationItemDto)
  items: CreateMemorizationItemDto[];
}