import { PartialType } from '@nestjs/swagger';
import { CreateTipoPasajeDto } from './create-tipo-pasaje.dto';

export class UpdateTipoPasajeDto extends PartialType(CreateTipoPasajeDto) {}