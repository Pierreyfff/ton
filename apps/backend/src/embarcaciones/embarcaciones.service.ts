import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmbarcacionDto } from './dto/create-embarcacion.dto';
import { UpdateEmbarcacionDto } from './dto/update-embarcacion.dto';

@Injectable()
export class EmbarcacionesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmbarcacionDto: CreateEmbarcacionDto) {
    return this.prisma.embarcacion.create({
      data: createEmbarcacionDto,
      include: {
        sede: true,
      },
    });
  }

  async findAll(sedeId?: number) {
    const where: any = { eliminado: false };
    if (sedeId) {
      where.id_sede = sedeId;
    }

    return this.prisma.embarcacion.findMany({
      where,
      include: {
        sede: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.embarcacion.findUnique({
      where: { id_embarcacion: id, eliminado: false },
      include: {
        sede: true,
        tours_programados: {
          where: { eliminado: false },
          include: {
            tipo_tour: true,
          },
        },
      },
    });
  }

  async findAvailable(fecha: string, sedeId?: number) {
    const fechaDate = new Date(fecha);
    
    return this.prisma.embarcacion.findMany({
      where: {
        eliminado: false,
        estado: 'DISPONIBLE',
        ...(sedeId && { id_sede: sedeId }),
        tours_programados: {
          none: {
            fecha: fechaDate,
            eliminado: false,
          },
        },
      },
      include: {
        sede: true,
      },
    });
  }

  async update(id: number, updateEmbarcacionDto: UpdateEmbarcacionDto) {
    return this.prisma.embarcacion.update({
      where: { id_embarcacion: id },
      data: updateEmbarcacionDto,
      include: {
        sede: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.embarcacion.update({
      where: { id_embarcacion: id },
      data: { eliminado: true },
    });
  }

  async updateEstado(id: number, estado: string) {
    return this.prisma.embarcacion.update({
      where: { id_embarcacion: id },
      data: { estado },
    });
  }
}