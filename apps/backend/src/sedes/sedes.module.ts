import { Module } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { SedesController } from './sedes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SedesController],
  providers: [SedesService],
})
export class SedesModule {}