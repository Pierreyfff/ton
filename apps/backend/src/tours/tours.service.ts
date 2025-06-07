import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tipoTour.findMany({
      where: { eliminado: false },
      include: {
        sede: true,
        tipo_tour_galerias: {
          where: { eliminado: false },
        },
        horarios_tour: {
          where: { eliminado: false },
        },
        tipos_pasaje: {
          where: { eliminado: false },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.tipoTour.findUnique({
      where: { id_tipo_tour: id, eliminado: false },
      include: {
        sede: true,
        tipo_tour_galerias: {
          where: { eliminado: false },
        },
        horarios_tour: {
          where: { eliminado: false },
        },
        tipos_pasaje: {
          where: { eliminado: false },
        },
        tours_programados: {
          where: { 
            eliminado: false,
            fecha: { gte: new Date() },
          },
          include: {
            embarcacion: true,
            horario: true,
          },
        },
      },
    });
  }

  async findAvailable(fecha: string, sedeId?: number) {
    const fechaDate = new Date(fecha);
    
    return this.prisma.tourProgramado.findMany({
      where: {
        fecha: fechaDate,
        eliminado: false,
        cupo_disponible: { gt: 0 },
        estado: 'PROGRAMADO',
        ...(sedeId && { id_sede: sedeId }),
      },
      include: {
        tipo_tour: {
          include: {
            sede: true, // Agregar sede aquí
            tipo_tour_galerias: {
              where: { eliminado: false },
            },
            tipos_pasaje: {
              where: { eliminado: false },
            },
          },
        },
        embarcacion: true,
        horario: true,
        sede: true, // Agregar sede a nivel de tour programado
      },
    });
  }

  async create(createTourDto: CreateTourDto) {
    return this.prisma.tipoTour.create({
      data: createTourDto,
    });
  }

  async update(id: number, updateTourDto: UpdateTourDto) {
    return this.prisma.tipoTour.update({
      where: { id_tipo_tour: id },
      data: updateTourDto,
    });
  }

  async remove(id: number) {
    return this.prisma.tipoTour.update({
      where: { id_tipo_tour: id },
      data: { eliminado: true },
    });
  }
}