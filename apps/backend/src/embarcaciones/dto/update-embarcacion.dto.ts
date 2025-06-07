import { PartialType } from '@nestjs/swagger';
import { CreateEmbarcacionDto } from './create-embarcacion.dto';

export class UpdateEmbarcacionDto extends PartialType(CreateEmbarcacionDto) {}