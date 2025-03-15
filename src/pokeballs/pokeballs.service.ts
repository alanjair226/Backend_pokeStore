import { Injectable } from '@nestjs/common';
import { CreatePokeballDto } from './dto/create-pokeball.dto';
import { UpdatePokeballDto } from './dto/update-pokeball.dto';

@Injectable()
export class PokeballsService {
  create(createPokeballDto: CreatePokeballDto) {
    return 'This action adds a new pokeball';
  }

  findAll() {
    return `This action returns all pokeballs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokeball`;
  }

  update(id: number, updatePokeballDto: UpdatePokeballDto) {
    return `This action updates a #${id} pokeball`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokeball`;
  }
}
