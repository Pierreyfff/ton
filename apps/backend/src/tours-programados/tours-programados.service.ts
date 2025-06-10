import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourProgramadoDto } from './dto/create-tour-programado.dto';
import { UpdateTourProgramadoDto } from './dto/update-tour-programado.dto';

@Injectable()
export class ToursProgramadosService {
  constructor(private prisma: PrismaService) {}

  async findDisponibles(fecha?: string, sedeId?: number) {
    try {
      const whereClause: any = {
        eliminado: false,
        cupo_disponible: { gt: 0 },
        estado: 'PROGRAMADO',
        fecha: fecha ? new Date(fecha) : { gte: new Date() },
        ...(sedeId && { id_sede: sedeId }),
      };

      // Si no se proporciona fecha, obtener tours de hoy en adelante
      if (!fecha) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        whereClause.fecha = { gte: today };
      }

      const tours = await this.prisma.tourProgramado.findMany({
        where: whereClause,
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
          chofer: {
            select: {
              id_usuario: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
        orderBy: [
          { fecha: 'asc' },
          { horario: { hora_inicio: 'asc' } },
        ],
      });

      console.log(`Found ${tours.length} available tours`);
      return tours;
    } catch (error) {
      console.error('Error in findDisponibles:', error);
      throw new InternalServerErrorException('Error al buscar tours disponibles');
    }
  }

  async buscar(fecha: string, pasajeros: number, sedeId?: number) {
    try {
      const fechaDate = new Date(fecha);

      const tours = await this.prisma.tourProgramado.findMany({
        where: {
          fecha: fechaDate,
          eliminado: false,
          cupo_disponible: { gte: pasajeros },
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
          chofer: {
            select: {
              id_usuario: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
        orderBy: {
          horario: { hora_inicio: 'asc' },
        },
      });

      console.log(`Found ${tours.length} tours for search criteria`);
      return tours;
    } catch (error) {
      console.error('Error in buscar:', error);
      throw new InternalServerErrorException('Error al buscar tours');
    }
  }

  async findAll(sedeId?: number) {
    try {
      const tours = await this.prisma.tourProgramado.findMany({
        where: {
          eliminado: false,
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
          chofer: {
            select: {
              id_usuario: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
        orderBy: [
          { fecha: 'asc' },
          { horario: { hora_inicio: 'asc' } },
        ],
      });

      return tours;
    } catch (error) {
      console.error('Error in findAll tours programados:', error);
      throw new InternalServerErrorException('Error al obtener tours programados');
    }
  }

  async findOne(id: number) {
    try {
      const tour = await this.prisma.tourProgramado.findUnique({
        where: { id_tour_programado: id, eliminado: false },
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
          chofer: {
            select: {
              id_usuario: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      });

      if (!tour) {
        throw new NotFoundException('Tour programado no encontrado');
      }

      return tour;
    } catch (error) {
      console.error('Error in findOne tour programado:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener tour programado');
    }
  }

  async create(createTourProgramadoDto: CreateTourProgramadoDto) {
    try {
      return await this.prisma.tourProgramado.create({
        data: {
          ...createTourProgramadoDto,
          eliminado: false,
        },
        include: {
          tipo_tour: true,
          embarcacion: true,
          horario: true,
          sede: true,
          chofer: {
            select: {
              id_usuario: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating tour programado:', error);
      throw new InternalServerErrorException('Error al crear tour programado');
    }
  }

  async update(id: number, updateTourProgramadoDto: UpdateTourProgramadoDto) {
    try {
      return await this.prisma.tourProgramado.update({
        where: { id_tour_programado: id },
        data: updateTourProgramadoDto,
        include: {
          tipo_tour: true,
          embarcacion: true,
          horario: true,
          sede: true,
          chofer: {
            select: {
              id_usuario: true,
              nombres: true,
              apellidos: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating tour programado:', error);
      throw new InternalServerErrorException('Error al actualizar tour programado');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.tourProgramado.update({
        where: { id_tour_programado: id },
        data: { eliminado: true },
      });
    } catch (error) {
      console.error('Error removing tour programado:', error);
      throw new InternalServerErrorException('Error al eliminar tour programado');
    }
  }
}