import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // ✅ Solo usar JwtAuthGuard por ahora
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @ApiOperation({ summary: 'Reporte de ventas en PDF' })
  @Get('ventas/pdf')
  async reporteVentasPdf(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('sedeId') sedeId?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.reportesService.generarReporteVentasPdf(
      fechaInicio,
      fechaFin,
      sedeId ? parseInt(sedeId) : undefined
    );
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte-ventas-${fechaInicio}-${fechaFin}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Reporte de ventas en Excel' })
  @Get('ventas/excel')
  async reporteVentasExcel(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('sedeId') sedeId?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.reportesService.generarReporteVentasExcel(
      fechaInicio,
      fechaFin,
      sedeId ? parseInt(sedeId) : undefined
    );
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=reporte-ventas-${fechaInicio}-${fechaFin}.xlsx`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }

  @ApiOperation({ summary: 'Dashboard analytics' })
  @Get('analytics')
  async getAnalytics(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('sedeId') sedeId?: string,
  ) {
    return this.reportesService.getAnalytics(
      fechaInicio,
      fechaFin,
      sedeId ? parseInt(sedeId) : undefined
    );
  }
}