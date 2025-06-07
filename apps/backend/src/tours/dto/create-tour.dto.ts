import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id_sede: number;

  @ApiProperty({ example: 'Tour Islas Ballestas Clásico' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Recorrido completo por las Islas Ballestas' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(1)
  duracion_minutos: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(1)
  cantidad_pasajeros: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  url_imagen?: string;
}