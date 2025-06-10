import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoPasajeDto } from './dto/create-tipo-pasaje.dto';
import { UpdateTipoPasajeDto } from './dto/update-tipo-pasaje.dto';

@Injectable()
export class TiposPasajeService {
  constructor(private prisma: PrismaService) {}

  async create(createTipoPasajeDto: CreateTipoPasajeDto) {
    return this.prisma.tipoPasaje.create({
      data: createTipoPasajeDto,
      include: {
        sede: true,
        tipo_tour: true,
      },
    });
  }

  async findAll(sedeId?: number, tipoTourId?: number, esFeriado?: boolean) {
    return this.prisma.tipoPasaje.findMany({
      where: { 
        eliminado: false,
        ...(sedeId && { id_sede: sedeId }),
        ...(tipoTourId && { id_tipo_tour: tipoTourId }),
        ...(esFeriado !== undefined && { es_feriado: esFeriado }),
      },
      include: {
        sede: {
          select: {
            id_sede: true,
            nombre: true,
          },
        },
        tipo_tour: {
          select: {
            id_tipo_tour: true,
            nombre: true,
          },
        },
      },
      orderBy: [
        { tipo_tour: { nombre: 'asc' } },
        { costo: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const tipoPasaje = await this.prisma.tipoPasaje.findUnique({
      where: { id_tipo_pasaje: id, eliminado: false },
      include: {
        sede: true,
        tipo_tour: true,
        pasajes_cantidad: {
          include: {
            reserva: {
              select: {
                id_reserva: true,
                fecha_reserva: true,
                estado: true,
              },
            },
          },
          take: 10,
          orderBy: { id_pasajes_cantidad: 'desc' },
        },
      },
    });

    if (!tipoPasaje) {
      throw new NotFoundException('Tipo de pasaje no encontrado');
    }

    return tipoPasaje;
  }

  async update(id: number, updateTipoPasajeDto: UpdateTipoPasajeDto) {
    await this.findOne(id);

    return this.prisma.tipoPasaje.update({
      where: { id_tipo_pasaje: id },
      data: updateTipoPasajeDto,
      include: {
        sede: true,
        tipo_tour: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.tipoPasaje.update({
      where: { id_tipo_pasaje: id },
      data: { eliminado: true },
    });
  }
}