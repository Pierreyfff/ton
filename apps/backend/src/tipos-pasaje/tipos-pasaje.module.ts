import { Module } from '@nestjs/common';
import { TiposPasajeService } from './tipos-pasaje.service';
import { TiposPasajeController } from './tipos-pasaje.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TiposPasajeController],
  providers: [TiposPasajeService],
})
export class TiposPasajeModule {}