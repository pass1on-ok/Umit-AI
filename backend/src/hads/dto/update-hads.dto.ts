import { PartialType } from '@nestjs/swagger';
import { CreateHadsDto } from './create-hads.dto';

export class UpdateHadsDto extends PartialType(CreateHadsDto) {}
