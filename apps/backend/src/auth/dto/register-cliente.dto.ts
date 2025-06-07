import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClienteDto {
  @ApiProperty({ example: 'DNI' })
  @IsString()
  tipo_documento: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  numero_documento: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Pérez García' })
  @IsString()
  apellidos: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  contrasena: string;
}