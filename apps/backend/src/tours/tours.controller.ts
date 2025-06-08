import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) { }

  @ApiOperation({ summary: 'Obtener todos los tours' })
  @Get()
  async findAll() {
    try {
      console.log('GET /tours - Fetching all tours');
      const tours = await this.toursService.findAll();
      console.log(`Returning ${tours.length} tours`);
      return tours;
    } catch (error) {
      console.error('Error in tours controller findAll:', error);
      throw new HttpException(
        'Error al obtener tours',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Obtener tours disponibles por fecha' })
  @Get('available')
  async findAvailable(
    @Query('fecha') fecha: string,
    @Query('sedeId') sedeId?: string,
  ) {
    try {
      console.log(`GET /tours/available - fecha: ${fecha}, sedeId: ${sedeId}`);

      if (!fecha) {
        throw new HttpException(
          'Fecha es requerida',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.toursService.findAvailable(fecha, sedeId ? parseInt(sedeId) : undefined);
    } catch (error) {
      console.error('Error in tours controller findAvailable:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al buscar tours disponibles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Obtener un tour por ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      console.log(`GET /tours/${id}`);

      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new HttpException(
          'ID inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.toursService.findOne(numericId);
    } catch (error) {
      console.error('Error in tours controller findOne:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener tour',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Crear un nuevo tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTourDto: CreateTourDto) {
    try {
      return await this.toursService.create(createTourDto);
    } catch (error) {
      console.error('Error in tours controller create:', error);
      throw new HttpException(
        'Error al crear tour',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Actualizar un tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new HttpException(
          'ID inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.toursService.update(numericId, updateTourDto);
    } catch (error) {
      console.error('Error in tours controller update:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar tour',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Eliminar un tour' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new HttpException(
          'ID inválido',
          HttpStatus.BAD_REQUEST
        );
      }

      return await this.toursService.remove(numericId);
    } catch (error) {
      console.error('Error in tours controller remove:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al eliminar tour',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}