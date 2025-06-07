import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Pagos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los pagos' })
  @Get()
  findAll(@Query('reservaId') reservaId?: string) {
    return this.pagosService.findAll(reservaId ? parseInt(reservaId) : undefined);
  }

  @ApiOperation({ summary: 'Obtener métodos de pago' })
  @Get('metodos')
  getMetodosPago(@Query('sedeId') sedeId?: string) {
    return this.pagosService.getMetodosPago(sedeId ? parseInt(sedeId) : undefined);
  }

  @ApiOperation({ summary: 'Obtener devoluciones' })
  @Get('devoluciones')
  findDevoluciones(@Query('pagoId') pagoId?: string) {
    return this.pagosService.findDevoluciones(pagoId ? parseInt(pagoId) : undefined);
  }

  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar un pago' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagosService.update(+id, updatePagoDto);
  }

  @ApiOperation({ summary: 'Eliminar un pago' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagosService.remove(+id);
  }

  @ApiOperation({ summary: 'Crear una devolución' })
  @Post('devoluciones')
  createDevolucion(@Body() createDevolucionDto: CreateDevolucionDto) {
    return this.pagosService.createDevolucion(createDevolucionDto);
  }

  @ApiOperation({ summary: 'Actualizar estado de devolución' })
  @Patch('devoluciones/:id')
  updateDevolucion(
    @Param('id') id: string,
    @Body() body: { estado: string; observaciones?: string }
  ) {
    return this.pagosService.updateDevolucion(+id, body.estado, body.observaciones);
  }
}