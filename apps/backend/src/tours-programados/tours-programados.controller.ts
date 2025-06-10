import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ToursProgramadosService } from './tours-programados.service';
import { CreateTourProgramadoDto } from './dto/create-tour-programado.dto';
import { UpdateTourProgramadoDto } from './dto/update-tour-programado.dto';
import { JwtAuthGuard } from '../auth//guards/jwt-auth.guard';

@ApiTags('tours-programados')
@Controller('tours-programados')
export class ToursProgramadosController {
  constructor(private readonly toursProgramadosService: ToursProgramadosService) {}

  @ApiOperation({ summary: 'Obtener tours disponibles' })
  @Get('disponibles')
  async findDisponibles(@Query('fecha') fecha?: string, @Query('sedeId') sedeId?: string) {
    try {
      console.log(`GET /tours-programados/disponibles - fecha: ${fecha}, sedeId: ${sedeId}`);
      
      return await this.toursProgramadosService.findDisponibles(
        fecha,
        sedeId ? parseInt(sedeId) : undefined
      );
    } catch (error) {
      console.error('Error in tours-programados controller findDisponibles:', error);
      throw new HttpException(
        'Error al obtener tours disponibles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Buscar tours por fecha y pasajeros' })
  @Get('buscar')
  async buscar(
    @Query('fecha') fecha: string,
    @Query('pasajeros') pasajeros: string,
    @Query('sedeId') sedeId?: string
  ) {
    try {
      console.log(`GET /tours-programados/buscar - fecha: ${fecha}, pasajeros: ${pasajeros}, sedeId: ${sedeId}`);

      if (!fecha) {
        throw new HttpException('Fecha es requerida', HttpStatus.BAD_REQUEST);
      }

      const numPasajeros = parseInt(pasajeros) || 1;
      const numSedeId = sedeId ? parseInt(sedeId) : undefined;

      return await this.toursProgramadosService.buscar(fecha, numPasajeros, numSedeId);
    } catch (error) {
      console.error('Error in tours-programados controller buscar:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al buscar tours',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Obtener todos los tours programados' })
  @Get()
  async findAll(@Query('sedeId') sedeId?: string) {
    try {
      return await this.toursProgramadosService.findAll(
        sedeId ? parseInt(sedeId) : undefined
      );
    } catch (error) {
      console.error('Error in tours-programados controller findAll:', error);
      throw new HttpException(
        'Error al obtener tours programados',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Obtener un tour programado por ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }

      return await this.toursProgramadosService.findOne(numericId);
    } catch (error) {
      console.error('Error in tours-programados controller findOne:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener tour programado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Crear un tour programado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTourProgramadoDto: CreateTourProgramadoDto) {
    try {
      return await this.toursProgramadosService.create(createTourProgramadoDto);
    } catch (error) {
      console.error('Error in tours-programados controller create:', error);
      throw new HttpException(
        'Error al crear tour programado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Actualizar un tour programado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTourProgramadoDto: UpdateTourProgramadoDto
  ) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }

      return await this.toursProgramadosService.update(numericId, updateTourProgramadoDto);
    } catch (error) {
      console.error('Error in tours-programados controller update:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar tour programado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Eliminar un tour programado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }

      return await this.toursProgramadosService.remove(numericId);
    } catch (error) {
      console.error('Error in tours-programados controller remove:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al eliminar tour programado',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}