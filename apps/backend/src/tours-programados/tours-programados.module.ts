import { Module } from '@nestjs/common';
import { ToursProgramadosService } from './tours-programados.service';
import { ToursProgramadosController } from './tours-programados.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ToursProgramadosController],
  providers: [ToursProgramadosService],
  exports: [ToursProgramadosService],
})
export class ToursProgramadosModule {}