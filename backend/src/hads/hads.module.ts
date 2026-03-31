import { Module } from '@nestjs/common';
import { HadsService } from './hads.service';
import { HadsController } from './hads.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [HadsController],
  providers: [HadsService],
  imports: [PrismaModule],
  exports: [HadsService]
})
export class HadsModule {}
