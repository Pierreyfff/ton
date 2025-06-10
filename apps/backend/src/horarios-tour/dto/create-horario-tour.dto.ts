import { IsNotEmpty, IsInt, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHorarioTourDto {
  @ApiProperty({ example: 1, description: 'ID del tipo de tour' })
  @IsInt()
  @IsNotEmpty()
  id_tipo_tour: number;

  @ApiProperty({ example: 1, description: 'ID de la sede' })
  @IsInt()
  @IsNotEmpty()
  id_sede: number;

  @ApiProperty({ example: '2025-06-10T08:00:00Z', description: 'Hora de inicio' })
  @IsDateString()
  @IsNotEmpty()
  hora_inicio: string;

  @ApiProperty({ example: '2025-06-10T10:00:00Z', description: 'Hora de fin' })
  @IsDateString()
  @IsNotEmpty()
  hora_fin: string;

  @ApiProperty({ example: true, description: 'Disponible los lunes' })
  @IsBoolean()
  @IsOptional()
  disponible_lunes?: boolean;

  @ApiProperty({ example: true, description: 'Disponible los martes' })
  @IsBoolean()
  @IsOptional()
  disponible_martes?: boolean;

  @ApiProperty({ example: true, description: 'Disponible los miércoles' })
  @IsBoolean()
  @IsOptional()
  disponible_miercoles?: boolean;

  @ApiProperty({ example: true, description: 'Disponible los jueves' })
  @IsBoolean()
  @IsOptional()
  disponible_jueves?: boolean;

  @ApiProperty({ example: true, description: 'Disponible los viernes' })
  @IsBoolean()
  @IsOptional()
  disponible_viernes?: boolean;

  @ApiProperty({ example: true, description: 'Disponible los sábados' })
  @IsBoolean()
  @IsOptional()
  disponible_sabado?: boolean;

  @ApiProperty({ example: true, description: 'Disponible los domingos' })
  @IsBoolean()
  @IsOptional()
  disponible_domingo?: boolean;
}