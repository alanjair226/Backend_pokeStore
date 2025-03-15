import { PartialType } from '@nestjs/mapped-types';
import { CreatePokeballDto } from './create-pokeball.dto';

export class UpdatePokeballDto extends PartialType(CreatePokeballDto) {}
