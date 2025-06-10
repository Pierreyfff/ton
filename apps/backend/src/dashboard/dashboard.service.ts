import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getEstadisticasGenerales(sedeId?: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const whereClause: any = {
        eliminado: false,
        ...(sedeId && { id_sede: sedeId }),
      };

      const [
        totalReservas,
        reservasHoy,
        reservasEsteMes,
        ingresosTotales,
        ingresosHoy,
        ingresosEsteMes,
        toursActivos,
        clientesRegistrados,
        embarcacionesDisponibles,
        reservasPendientes
      ] = await Promise.all([
        // Total reservas
        this.prisma.reserva.count({
          where: whereClause,
        }),
        // Reservas hoy
        this.prisma.reserva.count({
          where: {
            ...whereClause,
            fecha_reserva: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        }),
        // Reservas este mes
        this.prisma.reserva.count({
          where: {
            ...whereClause,
            fecha_reserva: {
              gte: new Date(today.getFullYear(), today.getMonth(), 1),
              lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            },
          },
        }),
        // Ingresos totales
        this.prisma.pago.aggregate({
          where: {
            eliminado: false,
            estado: 'PROCESADO',
            ...(sedeId && { id_sede: sedeId }),
          },
          _sum: { monto: true },
        }),
        // Ingresos hoy
        this.prisma.pago.aggregate({
          where: {
            eliminado: false,
            estado: 'PROCESADO',
            fecha_pago: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            ...(sedeId && { id_sede: sedeId }),
          },
          _sum: { monto: true },
        }),
        // Ingresos este mes
        this.prisma.pago.aggregate({
          where: {
            eliminado: false,
            estado: 'PROCESADO',
            fecha_pago: {
              gte: new Date(today.getFullYear(), today.getMonth(), 1),
              lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            },
            ...(sedeId && { id_sede: sedeId }),
          },
          _sum: { monto: true },
        }),
        // Tours activos (programados para hoy en adelante)
        this.prisma.tourProgramado.count({
          where: {
            eliminado: false,
            fecha: { gte: today },
            estado: 'PROGRAMADO',
            ...(sedeId && { id_sede: sedeId }),
          },
        }),
        // Clientes registrados
        this.prisma.cliente.count({
          where: { eliminado: false },
        }),
        // Embarcaciones disponibles
        this.prisma.embarcacion.count({
          where: {
            eliminado: false,
            estado: 'DISPONIBLE',
            ...(sedeId && { id_sede: sedeId }),
          },
        }),
        // Reservas pendientes
        this.prisma.reserva.count({
          where: {
            ...whereClause,
            estado: 'RESERVADO',
          },
        }),
      ]);

      return {
        totalReservas,
        reservasHoy,
        reservasEsteMes,
        ingresosTotales: ingresosTotales._sum.monto || 0,
        ingresosHoy: ingresosHoy._sum.monto || 0,
        ingresosEsteMes: ingresosEsteMes._sum.monto || 0,
        toursActivos,
        clientesRegistrados,
        embarcacionesDisponibles,
        reservasPendientes,
      };
    } catch (error) {
      console.error('Error getting estadísticas generales:', error);
      throw new InternalServerErrorException('Error al obtener estadísticas generales');
    }
  }

  async getEstadisticasVentas(periodo: string = 'mes', sedeId?: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let fechaInicio: Date;
      let fechaFin: Date = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      switch (periodo) {
        case 'dia':
          fechaInicio = today;
          break;
        case 'semana':
          fechaInicio = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'mes':
          fechaInicio = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'año':
          fechaInicio = new Date(today.getFullYear(), 0, 1);
          break;
        default:
          fechaInicio = new Date(today.getFullYear(), today.getMonth(), 1);
      }

      const ventasPorDia = await this.prisma.pago.groupBy({
        by: ['fecha_pago'],
        where: {
          eliminado: false,
          estado: 'PROCESADO',
          fecha_pago: {
            gte: fechaInicio,
            lt: fechaFin,
          },
          ...(sedeId && { id_sede: sedeId }),
        },
        _sum: { monto: true },
        _count: true,
        orderBy: { fecha_pago: 'asc' },
      });

      const ventasPorCanal = await this.prisma.pago.groupBy({
        by: ['id_canal'],
        where: {
          eliminado: false,
          estado: 'PROCESADO',
          fecha_pago: {
            gte: fechaInicio,
            lt: fechaFin,
          },
          ...(sedeId && { id_sede: sedeId }),
        },
        _sum: { monto: true },
        _count: true,
      });

      // Obtener nombres de canales
      const canales = await this.prisma.canalVenta.findMany({
        where: {
          id_canal: { in: ventasPorCanal.map(v => v.id_canal) },
        },
        select: { id_canal: true, nombre: true },
      });

      const ventasConNombreCanal = ventasPorCanal.map(venta => ({
        ...venta,
        nombreCanal: canales.find(c => c.id_canal === venta.id_canal)?.nombre || 'Desconocido',
      }));

      return {
        ventasPorDia: ventasPorDia.map(venta => ({
          fecha: venta.fecha_pago,
          ingresos: venta._sum.monto || 0,
          cantidad: venta._count,
        })),
        ventasPorCanal: ventasConNombreCanal.map(venta => ({
          canal: venta.nombreCanal,
          ingresos: venta._sum.monto || 0,
          cantidad: venta._count,
        })),
      };
    } catch (error) {
      console.error('Error getting estadísticas de ventas:', error);
      throw new InternalServerErrorException('Error al obtener estadísticas de ventas');
    }
  }

  async getToursPopulares(sedeId?: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const toursPopulares = await this.prisma.reserva.groupBy({
        by: ['id_tour_programado'],
        where: {
          eliminado: false,
          tour_programado: {
            eliminado: false,
            fecha: { gte: today },
            ...(sedeId && { id_sede: sedeId }),
          },
        },
        _count: true,
        orderBy: { _count: { id_tour_programado: 'desc' } },
        take: 10,
      });

      // Obtener detalles de los tours
      const tourIds = toursPopulares.map(t => t.id_tour_programado);
      const detallesTours = await this.prisma.tourProgramado.findMany({
        where: { id_tour_programado: { in: tourIds } },
        include: {
          tipo_tour: true,
          horario: true,
        },
      });

      return toursPopulares.map(tour => {
        const detalle = detallesTours.find(d => d.id_tour_programado === tour.id_tour_programado);
        return {
          id_tour_programado: tour.id_tour_programado,
          nombre: detalle?.tipo_tour.nombre || 'Tour Desconocido',
          fecha: detalle?.fecha,
          hora_inicio: detalle?.horario.hora_inicio,
          reservas: tour._count,
        };
      });
    } catch (error) {
      console.error('Error getting tours populares:', error);
      throw new InternalServerErrorException('Error al obtener tours populares');
    }
  }

  async getReservasRecientes(limite: number = 10, sedeId?: number) {
    try {
      const reservas = await this.prisma.reserva.findMany({
        where: {
          eliminado: false,
          ...(sedeId && { id_sede: sedeId }),
        },
        include: {
          cliente: {
            select: {
              nombres: true,
              apellidos: true,
              correo: true,
            },
          },
          tour_programado: {
            include: {
              tipo_tour: {
                select: {
                  nombre: true,
                },
              },
              horario: {
                select: {
                  hora_inicio: true,
                },
              },
            },
          },
          vendedor: {
            select: {
              nombres: true,
              apellidos: true,
            },
          },
          canal: {
            select: {
              nombre: true,
            },
          },
        },
        orderBy: { fecha_reserva: 'desc' },
        take: limite,
      });

      return reservas.map(reserva => ({
        id_reserva: reserva.id_reserva,
        cliente: `${reserva.cliente.nombres} ${reserva.cliente.apellidos}`,
        tour: reserva.tour_programado.tipo_tour.nombre,
        fecha_tour: reserva.tour_programado.fecha,
        hora_tour: reserva.tour_programado.horario.hora_inicio,
        fecha_reserva: reserva.fecha_reserva,
        total: reserva.total_pagar,
        estado: reserva.estado,
        vendedor: reserva.vendedor ? `${reserva.vendedor.nombres} ${reserva.vendedor.apellidos}` : null,
        canal: reserva.canal.nombre,
      }));
    } catch (error) {
      console.error('Error getting reservas recientes:', error);
      throw new InternalServerErrorException('Error al obtener reservas recientes');
    }
  }

  async getIngresosPorMetodoPago(sedeId?: number) {
    try {
      const today = new Date();
      const inicioMes = new Date(today.getFullYear(), today.getMonth(), 1);

      const ingresosPorMetodo = await this.prisma.pago.groupBy({
        by: ['id_metodo_pago'],
        where: {
          eliminado: false,
          estado: 'PROCESADO',
          fecha_pago: {
            gte: inicioMes,
          },
          ...(sedeId && { id_sede: sedeId }),
        },
        _sum: { monto: true },
        _count: true,
      });

      // Obtener nombres de métodos de pago
      const metodosPago = await this.prisma.metodoPago.findMany({
        where: {
          id_metodo_pago: { in: ingresosPorMetodo.map(i => i.id_metodo_pago) },
        },
        select: { id_metodo_pago: true, nombre: true },
      });

      return ingresosPorMetodo.map(ingreso => ({
        metodo: metodosPago.find(m => m.id_metodo_pago === ingreso.id_metodo_pago)?.nombre || 'Desconocido',
        ingresos: ingreso._sum.monto || 0,
        transacciones: ingreso._count,
      }));
    } catch (error) {
      console.error('Error getting ingresos por método de pago:', error);
      throw new InternalServerErrorException('Error al obtener ingresos por método de pago');
    }
  }

  async getOcupacionEmbarcaciones(sedeId?: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const embarcaciones = await this.prisma.embarcacion.findMany({
        where: {
          eliminado: false,
          ...(sedeId && { id_sede: sedeId }),
        },
        include: {
          tours_programados: {
            where: {
              eliminado: false,
              fecha: { gte: today },
              estado: 'PROGRAMADO',
            },
            select: {
              cupo_maximo: true,
              cupo_disponible: true,
            },
          },
        },
      });

      return embarcaciones.map(embarcacion => {
        const totalCupoMaximo = embarcacion.tours_programados.reduce(
          (sum, tour) => sum + tour.cupo_maximo, 0
        );
        const totalCupoDisponible = embarcacion.tours_programados.reduce(
          (sum, tour) => sum + tour.cupo_disponible, 0
        );
        const ocupacion = totalCupoMaximo > 0 
          ? Math.round(((totalCupoMaximo - totalCupoDisponible) / totalCupoMaximo) * 100)
          : 0;

        return {
          nombre: embarcacion.nombre,
          capacidad: embarcacion.capacidad,
          totalCupoMaximo,
          totalCupoDisponible,
          ocupacion,
          toursActivos: embarcacion.tours_programados.length,
        };
      });
    } catch (error) {
      console.error('Error getting ocupación embarcaciones:', error);
      throw new InternalServerErrorException('Error al obtener ocupación de embarcaciones');
    }
  }
}