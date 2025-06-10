import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  async generarReporteVentasPdf(
    fechaInicio: string,
    fechaFin: string,
    sedeId?: number
  ): Promise<Buffer> {
    const ventas = await this.getVentasData(fechaInicio, fechaFin, sedeId);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(18).text('Reporte de Ventas - Paracas Explorer', 50, 50);
      doc.fontSize(12).text(`Período: ${fechaInicio} - ${fechaFin}`, 50, 80);
      
      let y = 120;
      
      // Resumen
      const resumen = this.calcularResumenVentas(ventas);
      doc.fontSize(14).text('Resumen:', 50, y);
      y += 30;
      doc.fontSize(12)
        .text(`Total de reservas: ${resumen.totalReservas}`, 50, y)
        .text(`Ingresos totales: S/ ${resumen.ingresoTotal.toFixed(2)}`, 50, y + 20)
        .text(`Promedio por reserva: S/ ${resumen.promedioReserva.toFixed(2)}`, 50, y + 40);
      
      y += 80;
      
      // Tabla de ventas
      doc.fontSize(14).text('Detalle de Ventas:', 50, y);
      y += 30;
      
      // Headers
      doc.fontSize(10)
        .text('Fecha', 50, y)
        .text('Cliente', 120, y)
        .text('Tour', 220, y)
        .text('Pasajeros', 320, y)
        .text('Total', 380, y);
      
      y += 20;
      doc.moveTo(50, y).lineTo(450, y).stroke();
      y += 10;
      
      ventas.forEach((venta) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        doc.fontSize(9)
          .text(new Date(venta.fecha_reserva).toLocaleDateString(), 50, y)
          .text(`${venta.cliente.nombres} ${venta.cliente.apellidos}`, 120, y)
          .text(venta.tour_programado.tipo_tour.nombre, 220, y)
          .text(venta.pasajes_cantidad.reduce((sum, p) => sum + p.cantidad, 0).toString(), 320, y)
          .text(`S/ ${Number(venta.total_pagar).toFixed(2)}`, 380, y);
        
        y += 15;
      });

      doc.end();
    });
  }

  async generarReporteVentasExcel(
    fechaInicio: string,
    fechaFin: string,
    sedeId?: number
  ): Promise<Buffer> {
    const ventas = await this.getVentasData(fechaInicio, fechaFin, sedeId);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');
    
    // Headers
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'DNI/Doc', key: 'documento', width: 15 },
      { header: 'Tour', key: 'tour', width: 30 },
      { header: 'Fecha Tour', key: 'fechaTour', width: 15 },
      { header: 'Horario', key: 'horario', width: 15 },
      { header: 'Pasajeros', key: 'pasajeros', width: 10 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 },
    ];
    
    // Data
    ventas.forEach((venta) => {
      worksheet.addRow({
        fecha: new Date(venta.fecha_reserva).toLocaleDateString(),
        cliente: `${venta.cliente.nombres} ${venta.cliente.apellidos}`,
        documento: venta.cliente.numero_documento,
        tour: venta.tour_programado.tipo_tour.nombre,
        fechaTour: new Date(venta.tour_programado.fecha).toLocaleDateString(),
        horario: `${new Date(venta.tour_programado.horario.hora_inicio).toLocaleTimeString()} - ${new Date(venta.tour_programado.horario.hora_fin).toLocaleTimeString()}`,
        pasajeros: venta.pasajes_cantidad.reduce((sum, p) => sum + p.cantidad, 0),
        total: Number(venta.total_pagar),
        estado: venta.estado,
      });
    });
    
    // Styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    const buffer = await workbook.xlsx.writeBuffer();
return Buffer.from(buffer);

  }

  async getAnalytics(
    fechaInicio?: string,
    fechaFin?: string,
    sedeId?: number
  ) {
    const whereClause: any = {
      eliminado: false,
    };
    
    if (fechaInicio && fechaFin) {
      whereClause.fecha_reserva = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    }
    
    if (sedeId) {
      whereClause.id_sede = sedeId;
    }

    const [
      totalReservas,
      ingresoTotal,
      reservasPorEstado,
      ventasPorDia,
      toursMasVendidos
    ] = await Promise.all([
      this.prisma.reserva.count({ where: whereClause }),
      
      this.prisma.reserva.aggregate({
        where: whereClause,
        _sum: { total_pagar: true },
      }),
      
      this.prisma.reserva.groupBy({
        by: ['estado'],
        where: whereClause,
        _count: { _all: true },
      }),
      
      this.prisma.reserva.groupBy({
        by: ['fecha_reserva'],
        where: whereClause,
        _count: { _all: true },
        _sum: { total_pagar: true },
        orderBy: { fecha_reserva: 'asc' },
      }),
      
      // ✅ CORRECCIÓN: Simplificar la consulta de tours más vendidos
      this.prisma.reserva.findMany({
        where: whereClause,
        select: {
          id_tour_programado: true,
          total_pagar: true,
          tour_programado: {
            select: {
              tipo_tour: {
                select: {
                  nombre: true,
                }
              }
            }
          }
        },
        take: 100, // Obtener más datos para procesar localmente
      }),
    ]);

    // Procesar tours más vendidos localmente
    const toursMap = new Map();
    toursMasVendidos.forEach(reserva => {
      const tourId = reserva.id_tour_programado;
      const tourNombre = reserva.tour_programado.tipo_tour.nombre;
      
      if (toursMap.has(tourId)) {
        const existing = toursMap.get(tourId);
        existing.count += 1;
        existing.total += Number(reserva.total_pagar);
      } else {
        toursMap.set(tourId, {
          id_tour_programado: tourId,
          nombre: tourNombre,
          count: 1,
          total: Number(reserva.total_pagar)
        });
      }
    });

    const topTours = Array.from(toursMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      resumen: {
        totalReservas,
        ingresoTotal: Number(ingresoTotal._sum.total_pagar) || 0,
        promedioReserva: totalReservas > 0 
          ? Number(ingresoTotal._sum.total_pagar) / totalReservas 
          : 0,
      },
      reservasPorEstado,
      ventasPorDia,
      toursMasVendidos: topTours,
    };
  }

  private async getVentasData(fechaInicio: string, fechaFin: string, sedeId?: number) {
    return this.prisma.reserva.findMany({
      where: {
        fecha_reserva: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
        eliminado: false,
        ...(sedeId && { id_sede: sedeId }),
      },
      include: {
        cliente: true,
        tour_programado: {
          include: {
            tipo_tour: true,
            horario: true,
            embarcacion: true,
          },
        },
        pasajes_cantidad: {
          include: {
            tipo_pasaje: true,
          },
        },
      },
      orderBy: { fecha_reserva: 'desc' },
    });
  }

  private calcularResumenVentas(ventas: any[]) {
    const totalReservas = ventas.length;
    const ingresoTotal = ventas.reduce((sum, venta) => sum + Number(venta.total_pagar), 0);
    const promedioReserva = totalReservas > 0 ? ingresoTotal / totalReservas : 0;
    
    return {
      totalReservas,
      ingresoTotal,
      promedioReserva,
    };
  }
}