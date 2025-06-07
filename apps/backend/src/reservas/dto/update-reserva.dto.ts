import { PartialType } from '@nestjs/swagger';
import { CreateReservaDto } from './create-reserva.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @ApiProperty({ example: 'CONFIRMADO' })
  @IsOptional()
  @IsString()
  estado?: string;
}