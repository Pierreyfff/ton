import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourProgramadoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_tipo_tour: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_embarcacion: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_horario: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_sede: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_chofer: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cupo_maximo: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cupo_disponible: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  estado?: string = 'PROGRAMADO';
}