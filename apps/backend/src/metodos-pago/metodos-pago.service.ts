import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Injectable()
export class MetodosPagoService {
  constructor(private prisma: PrismaService) {}

  async create(createMetodoPagoDto: CreateMetodoPagoDto) {
    return this.prisma.metodoPago.create({
      data: createMetodoPagoDto,
      include: {
        sede: true,
      },
    });
  }

  async findAll(sedeId?: number) {
    return this.prisma.metodoPago.findMany({
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
            pagos: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const metodoPago = await this.prisma.metodoPago.findUnique({
      where: { id_metodo_pago: id, eliminado: false },
      include: {
        sede: true,
        pagos: {
          take: 10,
          orderBy: { fecha_pago: 'desc' },
          include: {
            reserva: {
              select: {
                id_reserva: true,
                cliente: {
                  select: {
                    nombres: true,
                    apellidos: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!metodoPago) {
      throw new NotFoundException('Método de pago no encontrado');
    }

    return metodoPago;
  }

  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto) {
    await this.findOne(id);

    return this.prisma.metodoPago.update({
      where: { id_metodo_pago: id },
      data: updateMetodoPagoDto,
      include: {
        sede: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.metodoPago.update({
      where: { id_metodo_pago: id },
      data: { eliminado: true },
    });
  }
}