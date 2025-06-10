import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CanalesVentaService } from './canales-venta.service';
import { CreateCanalVentaDto } from './dto/create-canal-venta.dto';
import { UpdateCanalVentaDto } from './dto/update-canal-venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('canales-venta')
@Controller('canales-venta')
export class CanalesVentaController {
  constructor(private readonly canalesVentaService: CanalesVentaService) {}

  @ApiOperation({ summary: 'Obtener todos los canales de venta' })
  @Get()
  findAll(@Query('sedeId') sedeId?: string) {
    return this.canalesVentaService.findAll(
      sedeId ? parseInt(sedeId) : undefined
    );
  }

  @ApiOperation({ summary: 'Obtener un canal de venta por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.canalesVentaService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear un nuevo canal de venta' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCanalVentaDto: CreateCanalVentaDto) {
    return this.canalesVentaService.create(createCanalVentaDto);
  }

  @ApiOperation({ summary: 'Actualizar un canal de venta' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCanalVentaDto: UpdateCanalVentaDto) {
    return this.canalesVentaService.update(+id, updateCanalVentaDto);
  }

  @ApiOperation({ summary: 'Eliminar un canal de venta' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.canalesVentaService.remove(+id);
  }
}