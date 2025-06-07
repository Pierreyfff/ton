import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async create(createPagoDto: CreatePagoDto) {
    // Verificar que la reserva existe
    const reserva = await this.prisma.reserva.findUnique({
      where: { id_reserva: createPagoDto.id_reserva },
    });

    if (!reserva) {
      throw new BadRequestException('Reserva no encontrada');
    }

    // Verificar que el monto no exceda el total de la reserva
    const pagosExistentes = await this.prisma.pago.aggregate({
      where: {
        id_reserva: createPagoDto.id_reserva,
        eliminado: false,
        estado: { not: 'CANCELADO' },
      },
      _sum: {
        monto: true,
      },
    });

    const totalPagado = Number(pagosExistentes._sum.monto || 0);
    const nuevoMonto = Number(createPagoDto.monto);
    
    if (totalPagado + nuevoMonto > Number(reserva.total_pagar)) {
      throw new BadRequestException('El monto excede el total de la reserva');
    }

    return this.prisma.pago.create({
      data: createPagoDto,
      include: {
        reserva: true,
        metodo_pago: true,
        canal: true,
        sede: true,
      },
    });
  }

  async findAll(reservaId?: number) {
    const where: any = { eliminado: false };
    if (reservaId) {
      where.id_reserva = reservaId;
    }

    return this.prisma.pago.findMany({
      where,
      include: {
        reserva: {
          include: {
            cliente: true,
          },
        },
        metodo_pago: true,
        canal: true,
        sede: true,
      },
      orderBy: { fecha_pago: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.pago.findUnique({
      where: { id_pago: id, eliminado: false },
      include: {
        reserva: {
          include: {
            cliente: true,
            tour_programado: {
              include: {
                tipo_tour: true,
              },
            },
          },
        },
        metodo_pago: true,
        canal: true,
        sede: true,
        devoluciones: true,
      },
    });
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    return this.prisma.pago.update({
      where: { id_pago: id },
      data: updatePagoDto,
      include: {
        reserva: true,
        metodo_pago: true,
        canal: true,
        sede: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.pago.update({
      where: { id_pago: id },
      data: { eliminado: true },
    });
  }

  async getMetodosPago(sedeId?: number) {
    const where: any = { eliminado: false };
    if (sedeId) {
      where.id_sede = sedeId;
    }

    return this.prisma.metodoPago.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });
  }

  async createDevolucion(createDevolucionDto: CreateDevolucionDto) {
    const pago = await this.prisma.pago.findUnique({
      where: { id_pago: createDevolucionDto.id_pago },
    });

    if (!pago) {
      throw new BadRequestException('Pago no encontrado');
    }

    if (Number(createDevolucionDto.monto_devolucion) > Number(pago.monto)) {
      throw new BadRequestException('El monto de devolución no puede ser mayor al monto del pago');
    }

    return this.prisma.devolucionPago.create({
      data: createDevolucionDto,
      include: {
        pago: {
          include: {
            reserva: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
    });
  }

  async findDevoluciones(pagoId?: number) {
    const where: any = {};
    if (pagoId) {
      where.id_pago = pagoId;
    }

    return this.prisma.devolucionPago.findMany({
      where,
      include: {
        pago: {
          include: {
            reserva: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      orderBy: { fecha_devolucion: 'desc' },
    });
  }

  async updateDevolucion(id: number, estado: string, observaciones?: string) {
    return this.prisma.devolucionPago.update({
      where: { id_devolucion: id },
      data: {
        estado,
        observaciones,
      },
    });
  }
}