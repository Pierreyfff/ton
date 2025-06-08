import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    try {
      const tours = await this.prisma.tipoTour.findMany({
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

      console.log(`Found ${tours.length} tours`);
      return tours;
    } catch (error) {
      console.error('Error in findAll tours:', error);
      throw new InternalServerErrorException('Error al obtener tours');
    }
  }

  async findOne(id: number) {
    try {
      const tour = await this.prisma.tipoTour.findUnique({
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

      if (!tour) {
        throw new Error('Tour no encontrado');
      }

      return tour;
    } catch (error) {
      console.error('Error in findOne tour:', error);
      throw new InternalServerErrorException('Error al obtener tour');
    }
  }

  async findAvailable(fecha: string, sedeId?: number) {
    try {
      const fechaDate = new Date(fecha);

      const tours = await this.prisma.tourProgramado.findMany({
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
              sede: true,
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
          sede: true,
        },
      });

      console.log(`Found ${tours.length} available tours for ${fecha}`);
      return tours;
    } catch (error) {
      console.error('Error in findAvailable tours:', error);
      throw new InternalServerErrorException('Error al buscar tours disponibles');
    }
  }

  async create(createTourDto: CreateTourDto) {
    try {
      return await this.prisma.tipoTour.create({
        data: createTourDto,
      });
    } catch (error) {
      console.error('Error creating tour:', error);
      throw new InternalServerErrorException('Error al crear tour');
    }
  }

  async update(id: number, updateTourDto: UpdateTourDto) {
    try {
      return await this.prisma.tipoTour.update({
        where: { id_tipo_tour: id },
        data: updateTourDto,
      });
    } catch (error) {
      console.error('Error updating tour:', error);
      throw new InternalServerErrorException('Error al actualizar tour');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.tipoTour.update({
        where: { id_tipo_tour: id },
        data: { eliminado: true },
      });
    } catch (error) {
      console.error('Error removing tour:', error);
      throw new InternalServerErrorException('Error al eliminar tour');
    }
  }
}