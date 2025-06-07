import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDevolucionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id_pago: number;

  @ApiProperty({ example: 'Cliente solicita cancelación' })
  @IsString()
  motivo: string;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  @Min(0.01)
  monto_devolucion: number;

  @ApiProperty({ example: 'PENDIENTE', required: false })
  @IsOptional()
  @IsString()
  estado?: string = 'PENDIENTE';

  @ApiProperty({ example: 'Devolución aprobada por gerencia', required: false })
  @IsOptional()
  @IsString()
  observaciones?: string;
}