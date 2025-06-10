import { PartialType } from '@nestjs/swagger';
import { CreateCanalVentaDto } from './create-canal-venta.dto';

export class UpdateCanalVentaDto extends PartialType(CreateCanalVentaDto) {}