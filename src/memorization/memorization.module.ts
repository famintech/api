import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MemorizationController } from './controllers/memorization.controller';
import { MemorizationService } from './services/memorization.service';

@Module({
  imports: [PrismaModule],
  controllers: [MemorizationController],
  providers: [MemorizationService],
  exports: [MemorizationService],
})
export class MemorizationModule {}