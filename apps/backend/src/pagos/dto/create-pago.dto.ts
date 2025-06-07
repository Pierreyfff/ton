import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePagoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id_reserva: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_metodo_pago: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_canal: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  id_sede: number;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  @Min(0.01)
  monto: number;

  @ApiProperty({ example: 'PROCESADO', required: false })
  @IsOptional()
  @IsString()
  estado?: string = 'PROCESADO';

  @ApiProperty({ example: 'B001-123456', required: false })
  @IsOptional()
  @IsString()
  numero_comprobante?: string;

  @ApiProperty({ example: 'https://example.com/comprobante.pdf', required: false })
  @IsOptional()
  @IsString()
  url_comprobante?: string;
}