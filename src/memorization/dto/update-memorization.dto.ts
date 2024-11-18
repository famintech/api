import { PartialType } from '@nestjs/mapped-types';
import { CreateMemorizationDto } from './create-memorization.dto';

export class UpdateMemorizationDto extends PartialType(CreateMemorizationDto) {}