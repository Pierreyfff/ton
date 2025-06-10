import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Obtener estadísticas generales del dashboard' })
  @Get('estadisticas')
  async getEstadisticas(@Query('sedeId') sedeId?: string) {
    return await this.dashboardService.getEstadisticasGenerales(
      sedeId ? parseInt(sedeId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener estadísticas de ventas' })
  @Get('ventas')
  async getEstadisticasVentas(
    @Query('periodo') periodo: string = 'mes',
    @Query('sedeId') sedeId?: string
  ) {
    return await this.dashboardService.getEstadisticasVentas(
      periodo,
      sedeId ? parseInt(sedeId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener tours más populares' })
  @Get('tours-populares')
  async getToursPopulares(@Query('sedeId') sedeId?: string) {
    return await this.dashboardService.getToursPopulares(
      sedeId ? parseInt(sedeId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener reservas recientes' })
  @Get('reservas-recientes')
  async getReservasRecientes(
    @Query('limite') limite: string = '10',
    @Query('sedeId') sedeId?: string
  ) {
    return await this.dashboardService.getReservasRecientes(
      parseInt(limite),
      sedeId ? parseInt(sedeId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener ingresos por método de pago' })
  @Get('ingresos-metodo-pago')
  async getIngresosPorMetodoPago(@Query('sedeId') sedeId?: string) {
    return await this.dashboardService.getIngresosPorMetodoPago(
      sedeId ? parseInt(sedeId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener ocupación de embarcaciones' })
  @Get('ocupacion-embarcaciones')
  async getOcupacionEmbarcaciones(@Query('sedeId') sedeId?: string) {
    return await this.dashboardService.getOcupacionEmbarcaciones(
      sedeId ? parseInt(sedeId) : undefined
    );
  }
}