import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Sedes')
@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @ApiOperation({ summary: 'Obtener todas las sedes' })
  @Get()
  findAll() {
    return this.sedesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una sede por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sedesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Crear una nueva sede' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSedeDto: CreateSedeDto) {
    return this.sedesService.create(createSedeDto);
  }

  @ApiOperation({ summary: 'Actualizar una sede' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSedeDto: UpdateSedeDto) {
    return this.sedesService.update(+id, updateSedeDto);
  }

  @ApiOperation({ summary: 'Eliminar una sede' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sedesService.remove(+id);
  }
}