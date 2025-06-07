import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Injectable()
export class SedesService {
  constructor(private prisma: PrismaService) {}

  async create(createSedeDto: CreateSedeDto) {
    return this.prisma.sede.create({
      data: createSedeDto,
    });
  }

  async findAll() {
    return this.prisma.sede.findMany({
      where: { eliminado: false },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.sede.findUnique({
      where: { id_sede: id, eliminado: false },
      include: {
        usuarios: {
          where: { eliminado: false },
        },
        embarcaciones: {
          where: { eliminado: false },
        },
        tipos_tour: {
          where: { eliminado: false },
        },
      },
    });
  }

  async update(id: number, updateSedeDto: UpdateSedeDto) {
    return this.prisma.sede.update({
      where: { id_sede: id },
      data: updateSedeDto,
    });
  }

  async remove(id: number) {
    return this.prisma.sede.update({
      where: { id_sede: id },
      data: { eliminado: true },
    });
  }
}