import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @ApiOperation({ summary: 'Obtener todos los tours' })
  @Get()
  findAll() {
    return this.toursService.findAll();
  }

  @ApiOperation({ summary: 'Obtener tours disponibles por fecha' })
  @Get('available')
  findAvailable(
    @Query('fecha') fecha: string,
    @Query('sedeId') sedeId?: string,
  ) {
    return this.toursService.findAvailable(fecha, sedeId ? parseInt(sedeId) : undefined);
  }

  @ApiOperation({ summary: 'Obtener un tour por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear un nuevo tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @ApiOperation({ summary: 'Actualizar un tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(+id, updateTourDto);
  }

  @ApiOperation({ summary: 'Eliminar un tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toursService.remove(+id);
  }
}