import { PartialType } from '@nestjs/swagger';
import { CreateTourProgramadoDto } from './create-tour-programado.dto';

export class UpdateTourProgramadoDto extends PartialType(CreateTourProgramadoDto) {}