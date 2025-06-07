import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.clientesService.search(search);
    }
    return this.clientesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Buscar cliente por documento' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('documento/:tipo/:numero')
  findByDocument(@Param('tipo') tipo: string, @Param('numero') numero: string) {
    return this.clientesService.findByDocument(tipo, numero);
  }

  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}