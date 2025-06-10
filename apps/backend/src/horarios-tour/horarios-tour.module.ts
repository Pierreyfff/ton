import { Module } from '@nestjs/common';
import { HorariosTourService } from './horarios-tour.service';
import { HorariosTourController } from './horarios-tour.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HorariosTourController],
  providers: [HorariosTourService],
})
export class HorariosTourModule {}