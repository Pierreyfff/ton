import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TiposPasajeService } from './tipos-pasaje.service';
import { CreateTipoPasajeDto } from './dto/create-tipo-pasaje.dto';
import { UpdateTipoPasajeDto } from './dto/update-tipo-pasaje.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tipos-pasaje')
@Controller('tipos-pasaje')
export class TiposPasajeController {
  constructor(private readonly tiposPasajeService: TiposPasajeService) {}

  @ApiOperation({ summary: 'Obtener todos los tipos de pasaje' })
  @Get()
  findAll(
    @Query('sedeId') sedeId?: string, 
    @Query('tipoTourId') tipoTourId?: string,
    @Query('esFeriado') esFeriado?: string
  ) {
    return this.tiposPasajeService.findAll(
      sedeId ? parseInt(sedeId) : undefined,
      tipoTourId ? parseInt(tipoTourId) : undefined,
      esFeriado === 'true'
    );
  }

  @ApiOperation({ summary: 'Obtener un tipo de pasaje por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposPasajeService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear un nuevo tipo de pasaje' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTipoPasajeDto: CreateTipoPasajeDto) {
    return this.tiposPasajeService.create(createTipoPasajeDto);
  }

  @ApiOperation({ summary: 'Actualizar un tipo de pasaje' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoPasajeDto: UpdateTipoPasajeDto) {
    return this.tiposPasajeService.update(+id, updateTipoPasajeDto);
  }

  @ApiOperation({ summary: 'Eliminar un tipo de pasaje' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposPasajeService.remove(+id);
  }
}