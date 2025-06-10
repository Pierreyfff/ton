import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHorarioTourDto } from './dto/create-horario-tour.dto';
import { UpdateHorarioTourDto } from './dto/update-horario-tour.dto';

@Injectable()
export class HorariosTourService {
  constructor(private prisma: PrismaService) {}

  async create(createHorarioTourDto: CreateHorarioTourDto) {
    return this.prisma.horarioTour.create({
      data: createHorarioTourDto,
      include: {
        tipo_tour: true,
        sede: true,
      },
    });
  }

  async findAll(sedeId?: number, tipoTourId?: number) {
    return this.prisma.horarioTour.findMany({
      where: { 
        eliminado: false,
        ...(sedeId && { id_sede: sedeId }),
        ...(tipoTourId && { id_tipo_tour: tipoTourId }),
      },
      include: {
        tipo_tour: true,
        sede: true,
      },
      orderBy: { hora_inicio: 'asc' },
    });
  }

  async findOne(id: number) {
    const horario = await this.prisma.horarioTour.findUnique({
      where: { id_horario: id, eliminado: false },
      include: {
        tipo_tour: true,
        sede: true,
        tours_programados: {
          where: { eliminado: false },
          take: 10,
          orderBy: { fecha: 'desc' },
        },
      },
    });

    if (!horario) {
      throw new NotFoundException('Horario de tour no encontrado');
    }

    return horario;
  }

  async update(id: number, updateHorarioTourDto: UpdateHorarioTourDto) {
    await this.findOne(id);

    return this.prisma.horarioTour.update({
      where: { id_horario: id },
      data: updateHorarioTourDto,
      include: {
        tipo_tour: true,
        sede: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.horarioTour.update({
      where: { id_horario: id },
      data: { eliminado: true },
    });
  }
}