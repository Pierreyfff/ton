import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterClienteDto } from './dto/register-cliente.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Buscar en usuarios (admin/vendedor/chofer)
    const user = await this.prisma.usuario.findUnique({
      where: { correo: email, eliminado: false },
      include: { sede: true },
    });

    if (user && user.contrasena && await bcrypt.compare(password, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }

    // Buscar en clientes
    const cliente = await this.prisma.cliente.findUnique({
      where: { correo: email, eliminado: false },
    });

    if (cliente && cliente.contrasena && await bcrypt.compare(password, cliente.contrasena)) {
      const { contrasena, ...result } = cliente;
      return { ...result, rol: 'CLIENTE' };
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.correo, loginDto.contrasena);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id_usuario || user.id_cliente, 
      email: user.correo, 
      rol: user.rol,
      tipo: user.id_usuario ? 'usuario' : 'cliente'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario || user.id_cliente,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.rol,
        tipo: user.id_usuario ? 'usuario' : 'cliente',
        sede: user.sede || null,
      },
    };
  }

  async registerCliente(registerDto: RegisterClienteDto) {
    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 10);

    const cliente = await this.prisma.cliente.create({
      data: {
        ...registerDto,
        contrasena: hashedPassword,
      },
    });

    const { contrasena, ...result } = cliente;
    return result;
  }
}