import { Module } from '@nestjs/common';
import { EmbarcacionesService } from './embarcaciones.service';
import { EmbarcacionesController } from './embarcaciones.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmbarcacionesController],
  providers: [EmbarcacionesService],
})
export class EmbarcacionesModule {}