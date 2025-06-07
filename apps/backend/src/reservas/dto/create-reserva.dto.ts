import { IsNumber, IsOptional, IsString, IsArray, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PasajeReservaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id_tipo_pasaje: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  cantidad: number;
}

export class CreateReservaDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  id_vendedor?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_cliente: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_tour_programado: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_canal: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_sede: number;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  total_pagar: number;

  @ApiProperty({ example: 'Reserva para familia con niños' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ type: [PasajeReservaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PasajeReservaDto)
  pasajes: PasajeReservaDto[];
}