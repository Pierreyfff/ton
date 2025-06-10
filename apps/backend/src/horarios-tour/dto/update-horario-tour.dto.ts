import { PartialType } from '@nestjs/swagger';
import { CreateHorarioTourDto } from './create-horario-tour.dto';

export class UpdateHorarioTourDto extends PartialType(CreateHorarioTourDto) {}