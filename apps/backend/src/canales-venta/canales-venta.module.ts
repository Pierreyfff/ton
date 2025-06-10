import { Module } from '@nestjs/common';
import { CanalesVentaService } from './canales-venta.service';
import { CanalesVentaController } from './canales-venta.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CanalesVentaController],
  providers: [CanalesVentaService],
})
export class CanalesVentaModule {}