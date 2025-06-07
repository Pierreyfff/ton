import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EmbarcacionesService } from './embarcaciones.service';
import { CreateEmbarcacionDto } from './dto/create-embarcacion.dto';
import { UpdateEmbarcacionDto } from './dto/update-embarcacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Embarcaciones')
@Controller('embarcaciones')
export class EmbarcacionesController {
  constructor(private readonly embarcacionesService: EmbarcacionesService) {}

  @ApiOperation({ summary: 'Obtener todas las embarcaciones' })
  @Get()
  findAll(@Query('sedeId') sedeId?: string) {
    return this.embarcacionesService.findAll(sedeId ? parseInt(sedeId) : undefined);
  }

  @ApiOperation({ summary: 'Obtener embarcaciones disponibles por fecha' })
  @Get('available')
  findAvailable(
    @Query('fecha') fecha: string,
    @Query('sedeId') sedeId?: string,
  ) {
    return this.embarcacionesService.findAvailable(fecha, sedeId ? parseInt(sedeId) : undefined);
  }

  @ApiOperation({ summary: 'Obtener una embarcación por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.embarcacionesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear una nueva embarcación' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEmbarcacionDto: CreateEmbarcacionDto) {
    return this.embarcacionesService.create(createEmbarcacionDto);
  }

  @ApiOperation({ summary: 'Actualizar una embarcación' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmbarcacionDto: UpdateEmbarcacionDto) {
    return this.embarcacionesService.update(+id, updateEmbarcacionDto);
  }

  @ApiOperation({ summary: 'Actualizar estado de embarcación' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.embarcacionesService.updateEstado(+id, estado);
  }

  @ApiOperation({ summary: 'Eliminar una embarcación' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.embarcacionesService.remove(+id);
  }
}