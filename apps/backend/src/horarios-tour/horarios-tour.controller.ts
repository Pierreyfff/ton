import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { HorariosTourService } from './horarios-tour.service';
import { CreateHorarioTourDto } from './dto/create-horario-tour.dto';
import { UpdateHorarioTourDto } from './dto/update-horario-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('horarios-tour')
@Controller('horarios-tour')
export class HorariosTourController {
  constructor(private readonly horariosTourService: HorariosTourService) {}

  @ApiOperation({ summary: 'Obtener todos los horarios de tour' })
  @Get()
  findAll(@Query('sedeId') sedeId?: string, @Query('tipoTourId') tipoTourId?: string) {
    return this.horariosTourService.findAll(
      sedeId ? parseInt(sedeId) : undefined,
      tipoTourId ? parseInt(tipoTourId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener un horario de tour por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horariosTourService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear un nuevo horario de tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHorarioTourDto: CreateHorarioTourDto) {
    return this.horariosTourService.create(createHorarioTourDto);
  }

  @ApiOperation({ summary: 'Actualizar un horario de tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorarioTourDto: UpdateHorarioTourDto) {
    return this.horariosTourService.update(+id, updateHorarioTourDto);
  }

  @ApiOperation({ summary: 'Eliminar un horario de tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horariosTourService.remove(+id);
  }
}