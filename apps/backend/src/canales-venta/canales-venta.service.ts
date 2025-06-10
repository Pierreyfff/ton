import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCanalVentaDto } from './dto/create-canal-venta.dto';
import { UpdateCanalVentaDto } from './dto/update-canal-venta.dto';

@Injectable()
export class CanalesVentaService {
  constructor(private prisma: PrismaService) {}

  async create(createCanalVentaDto: CreateCanalVentaDto) {
    return this.prisma.canalVenta.create({
      data: createCanalVentaDto,
      include: {
        sede: true,
      },
    });
  }

  async findAll(sedeId?: number) {
    return this.prisma.canalVenta.findMany({
      where: { 
        eliminado: false,
        ...(sedeId && { id_sede: sedeId }),
      },
      include: {
        sede: {
          select: {
            id_sede: true,
            nombre: true,
          },
        },
        _count: {
          select: {
            reservas: true,
            pagos: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const canalVenta = await this.prisma.canalVenta.findUnique({
      where: { id_canal: id, eliminado: false },
      include: {
        sede: true,
        reservas: {
          take: 10,
          orderBy: { fecha_reserva: 'desc' },
          include: {
            cliente: {
              select: {
                nombres: true,
                apellidos: true,
              },
            },
            tour_programado: {
              select: {
                tipo_tour: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            reservas: true,
            pagos: true,
          },
        },
      },
    });

    if (!canalVenta) {
      throw new NotFoundException('Canal de venta no encontrado');
    }

    return canalVenta;
  }

  async update(id: number, updateCanalVentaDto: UpdateCanalVentaDto) {
    await this.findOne(id);

    return this.prisma.canalVenta.update({
      where: { id_canal: id },
      data: updateCanalVentaDto,
      include: {
        sede: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.canalVenta.update({
      where: { id_canal: id },
      data: { eliminado: true },
    });
  }
}