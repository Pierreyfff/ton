import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @Post()
  create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    // Si es cliente, asegurar que la reserva sea para él
    if (req.user.rol === 'CLIENTE') {
      createReservaDto.id_cliente = req.user.userId;
    }
    return this.reservasService.create(createReservaDto);
  }

  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @Get()
  findAll(@Request() req) {
    return this.reservasService.findAll(req.user.userId, req.user.rol);
  }

  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.reservasService.findOne(+id, req.user.userId, req.user.rol);
  }

  @ApiOperation({ summary: 'Actualizar una reserva' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }

  @ApiOperation({ summary: 'Cancelar una reserva' })
  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.reservasService.cancel(+id);
  }
}