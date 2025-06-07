import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
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

  @ApiProperty({ example: 'juan.perez@email.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  contrasena?: string;
}