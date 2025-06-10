import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCanalVentaDto {
  @ApiProperty({ example: 1, description: 'ID de la sede' })
  @IsInt()
  @IsNotEmpty()
  id_sede: number;

  @ApiProperty({ example: 'Sitio Web', description: 'Nombre del canal de venta' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Ventas a través del sitio web oficial', description: 'Descripción del canal' })
  @IsString()
  @IsOptional()
  descripcion?: string;
}