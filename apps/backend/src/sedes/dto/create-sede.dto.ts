import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSedeDto {
  @ApiProperty({ example: 'Sede Paracas' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Av. Paracas 123' })
  @IsString()
  direccion: string;

  @ApiProperty({ example: '056-545678', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'paracas@ton.com', required: false })
  @IsOptional()
  @IsString()
  correo?: string;

  @ApiProperty({ example: 'Paracas' })
  @IsString()
  distrito: string;

  @ApiProperty({ example: 'Pisco', required: false })
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiProperty({ example: 'Perú' })
  @IsString()
  pais: string;

  @ApiProperty({ example: 'https://example.com/sede.jpg', required: false })
  @IsOptional()
  @IsString()
  image_url?: string;
}