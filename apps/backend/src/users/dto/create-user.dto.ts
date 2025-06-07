import { IsString, IsEmail, IsOptional, IsIn, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  id_sede?: number;

  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'García López' })
  @IsString()
  apellidos: string;

  @ApiProperty({ example: 'juan.garcia@ton.com', required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({ example: '987654321', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Av. Principal 123', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ example: '1990-05-15', required: false })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  @IsIn(['ADMIN', 'VENDEDOR', 'CHOFER'])
  rol: string;

  @ApiProperty({ example: 'Peruana', required: false })
  @IsOptional()
  @IsString()
  nacionalidad?: string;

  @ApiProperty({ example: 'DNI' })
  @IsString()
  tipo_de_documento: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  numero_documento: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @IsString()
  contrasena?: string;
}