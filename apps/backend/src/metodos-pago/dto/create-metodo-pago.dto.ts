import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetodoPagoDto {
  @ApiProperty({ example: 1, description: 'ID de la sede' })
  @IsInt()
  @IsNotEmpty()
  id_sede: number;

  @ApiProperty({ example: 'Efectivo', description: 'Nombre del método de pago' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Pago en efectivo en soles', description: 'Descripción del método de pago' })
  @IsString()
  @IsOptional()
  descripcion?: string;
}