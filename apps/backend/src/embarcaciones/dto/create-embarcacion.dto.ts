import { IsString, IsNumber, IsOptional, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmbarcacionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id_sede: number;

  @ApiProperty({ example: 'Lancha Ballestas I' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(1)
  capacidad: number;

  @ApiProperty({ example: 'Lancha moderna con todas las comodidades', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 'DISPONIBLE' })
  @IsOptional()
  @IsString()
  @IsIn(['DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'])
  estado?: string = 'DISPONIBLE';
}