import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    // Verificar si ya existe un cliente con el mismo documento
    const existingCliente = await this.prisma.cliente.findFirst({
      where: {
        tipo_documento: createClienteDto.tipo_documento,
        numero_documento: createClienteDto.numero_documento,
        eliminado: false,
      },
    });

    if (existingCliente) {
      throw new ConflictException('Ya existe un cliente con este documento');
    }

    // Verificar si ya existe un cliente con el mismo correo
    if (createClienteDto.correo) {
      const existingEmail = await this.prisma.cliente.findFirst({
        where: {
          correo: createClienteDto.correo,
          eliminado: false,
        },
      });

      if (existingEmail) {
        throw new ConflictException('Ya existe un cliente con este correo');
      }
    }

    const data: any = { ...createClienteDto };

    // Hashear contraseña si se proporciona
    if (createClienteDto.contrasena) {
      data.contrasena = await bcrypt.hash(createClienteDto.contrasena, 10);
    }

    return this.prisma.cliente.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany({
      where: { eliminado: false },
      orderBy: { nombres: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.cliente.findUnique({
      where: { id_cliente: id, eliminado: false },
      include: {
        reservas: {
          include: {
            tour_programado: {
              include: {
                tipo_tour: true,
              },
            },
          },
        },
      },
    });
  }

  async findByDocument(tipo_documento: string, numero_documento: string) {
    return this.prisma.cliente.findFirst({
      where: {
        tipo_documento,
        numero_documento,
        eliminado: false,
      },
    });
  }

  async findByEmail(correo: string) {
    return this.prisma.cliente.findFirst({
      where: {
        correo,
        eliminado: false,
      },
    });
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const data: any = { ...updateClienteDto };

    // Hashear contraseña si se actualiza
    if (updateClienteDto.contrasena) {
      data.contrasena = await bcrypt.hash(updateClienteDto.contrasena, 10);
    }

    return this.prisma.cliente.update({
      where: { id_cliente: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.cliente.update({
      where: { id_cliente: id },
      data: { eliminado: true },
    });
  }

  async search(query: string) {
    return this.prisma.cliente.findMany({
      where: {
        eliminado: false,
        OR: [
          { nombres: { contains: query, mode: 'insensitive' } },
          { apellidos: { contains: query, mode: 'insensitive' } },
          { correo: { contains: query, mode: 'insensitive' } },
          { numero_documento: { contains: query } },
        ],
      },
      orderBy: { nombres: 'asc' },
    });
  }
}