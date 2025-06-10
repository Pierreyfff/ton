import { IsString, IsNotEmpty, IsNumber, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoPasajeDto {
  @ApiProperty({ example: 1, description: 'ID de la sede' })
  @IsInt()
  @IsNotEmpty()
  id_sede: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de tour' })
  @IsInt()
  @IsNotEmpty()
  id_tipo_tour: number;

  @ApiProperty({ example: 'Adulto Nacional', description: 'Nombre del tipo de pasaje' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 35.00, description: 'Costo del pasaje' })
  @IsNumber()
  @Min(0)
  costo: number;

  @ApiProperty({ example: '12 años en adelante', description: 'Rango de edad' })
  @IsString()
  @IsOptional()
  edad?: string;

  @ApiProperty({ example: false, description: 'Si es precio para feriados' })
  @IsBoolean()
  @IsOptional()
  es_feriado?: boolean;
}