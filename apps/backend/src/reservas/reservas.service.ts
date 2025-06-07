import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private prisma: PrismaService) {}

  async create(createReservaDto: CreateReservaDto) {
    // Verificar disponibilidad del tour
    const tourProgramado = await this.prisma.tourProgramado.findUnique({
      where: { id_tour_programado: createReservaDto.id_tour_programado },
      include: { tipo_tour: true },
    });

    if (!tourProgramado) {
      throw new BadRequestException('Tour no encontrado');
    }

    const totalPasajeros = createReservaDto.pasajes.reduce((sum, p) => sum + p.cantidad, 0);
    
    if (tourProgramado.cupo_disponible < totalPasajeros) {
      throw new BadRequestException('No hay suficiente disponibilidad');
    }

    return this.prisma.$transaction(async (tx) => {
      // Crear la reserva
      const reserva = await tx.reserva.create({
        data: {
          id_cliente: createReservaDto.id_cliente,
          id_tour_programado: createReservaDto.id_tour_programado,
          id_canal: createReservaDto.id_canal,
          id_sede: createReservaDto.id_sede,
          total_pagar: createReservaDto.total_pagar,
          notas: createReservaDto.notas,
          id_vendedor: createReservaDto.id_vendedor,
        },
        include: {
          cliente: true,
          tour_programado: {
            include: {
              tipo_tour: true,
              embarcacion: true,
              horario: true,
            },
          },
        },
      });

      // Crear los detalles de pasajes
      for (const pasaje of createReservaDto.pasajes) {
        await tx.pasajesCantidad.create({
          data: {
            id_reserva: reserva.id_reserva,
            id_tipo_pasaje: pasaje.id_tipo_pasaje,
            cantidad: pasaje.cantidad,
          },
        });
      }

      // Actualizar cupo disponible
      await tx.tourProgramado.update({
        where: { id_tour_programado: createReservaDto.id_tour_programado },
        data: {
          cupo_disponible: {
            decrement: totalPasajeros,
          },
        },
      });

      return reserva;
    });
  }

  async findAll(userId?: number, rol?: string) {
    const where: any = { eliminado: false };
    
    // Si es cliente, solo mostrar sus reservas
    if (rol === 'CLIENTE') {
      where.id_cliente = userId;
    }

    return this.prisma.reserva.findMany({
      where,
      include: {
        cliente: true,
        vendedor: true,
        tour_programado: {
          include: {
            tipo_tour: true,
            embarcacion: true,
            horario: true,
          },
        },
        pasajes_cantidad: {
          include: {
            tipo_pasaje: true,
          },
        },
        pagos: true,
      },
      orderBy: { fecha_reserva: 'desc' },
    });
  }

  async findOne(id: number, userId?: number, rol?: string) {
    const where: any = { id_reserva: id, eliminado: false };
    
    // Si es cliente, verificar que sea su reserva
    if (rol === 'CLIENTE') {
      where.id_cliente = userId;
    }

    return this.prisma.reserva.findUnique({
      where,
      include: {
        cliente: true,
        vendedor: true,
        tour_programado: {
          include: {
            tipo_tour: true,
            embarcacion: true,
            horario: true,
          },
        },
        pasajes_cantidad: {
          include: {
            tipo_pasaje: true,
          },
        },
        pagos: {
          include: {
            metodo_pago: true,
          },
        },
      },
    });
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    return this.prisma.reserva.update({
      where: { id_reserva: id },
      data: updateReservaDto,
    });
  }

  async cancel(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({
        where: { id_reserva: id },
        include: { pasajes_cantidad: true },
      });

      if (!reserva) {
        throw new BadRequestException('Reserva no encontrada');
      }

      // Calcular total de pasajeros a devolver
      const totalPasajeros = reserva.pasajes_cantidad.reduce((sum, p) => sum + p.cantidad, 0);

      // Actualizar estado de la reserva
      await tx.reserva.update({
        where: { id_reserva: id },
        data: { estado: 'CANCELADO' },
      });

      // Devolver cupo al tour
      await tx.tourProgramado.update({
        where: { id_tour_programado: reserva.id_tour_programado },
        data: {
          cupo_disponible: {
            increment: totalPasajeros,
          },
        },
      });

      return reserva;
    });
  }
}