import { IsInt, IsBoolean, Min, Max } from 'class-validator';

export class UpdateItemProgressDto {
  @IsInt()
  @Min(1)
  repetitionNumber: number;

  @IsBoolean()
  completed: boolean;
}