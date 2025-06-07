import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar si ya existe un usuario con el mismo documento
    const existingUser = await this.prisma.usuario.findFirst({
      where: {
        tipo_de_documento: createUserDto.tipo_de_documento,
        numero_documento: createUserDto.numero_documento,
        eliminado: false,
      },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este documento');
    }

    // Verificar si ya existe un usuario con el mismo correo
    if (createUserDto.correo) {
      const existingEmail = await this.prisma.usuario.findFirst({
        where: {
          correo: createUserDto.correo,
          eliminado: false,
        },
      });

      if (existingEmail) {
        throw new ConflictException('Ya existe un usuario con este correo');
      }
    }

    const data: any = { ...createUserDto };

    // Hashear contraseña si se proporciona
    if (createUserDto.contrasena) {
      data.contrasena = await bcrypt.hash(createUserDto.contrasena, 10);
    }

    return this.prisma.usuario.create({
      data,
      include: {
        sede: true,
      },
    });
  }

  async findAll(sedeId?: number, rol?: string) {
    const where: any = { eliminado: false };
    
    if (sedeId) {
      where.id_sede = sedeId;
    }
    
    if (rol) {
      where.rol = rol;
    }

    return this.prisma.usuario.findMany({
      where,
      include: {
        sede: true,
      },
      orderBy: [{ nombres: 'asc' }, { apellidos: 'asc' }],
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id, eliminado: false },
      include: {
        sede: true,
        usuario_idiomas: {
          include: {
            idioma: true,
          },
        },
        horarios_chofer: {
          where: { eliminado: false },
        },
      },
    });
  }

  async findByEmail(correo: string) {
    return this.prisma.usuario.findUnique({
      where: { correo, eliminado: false },
      include: {
        sede: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };

    // Hashear contraseña si se actualiza
    if (updateUserDto.contrasena) {
      data.contrasena = await bcrypt.hash(updateUserDto.contrasena, 10);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data,
      include: {
        sede: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: { eliminado: true },
    });
  }

  async getChoferes(sedeId?: number) {
    const where: any = {
      eliminado: false,
      rol: 'CHOFER',
    };

    if (sedeId) {
      where.id_sede = sedeId;
    }

    return this.prisma.usuario.findMany({
      where,
      include: {
        sede: true,
        horarios_chofer: {
          where: { eliminado: false },
        },
      },
      orderBy: [{ nombres: 'asc' }, { apellidos: 'asc' }],
    });
  }
}