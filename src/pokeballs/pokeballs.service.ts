import { Injectable } from '@nestjs/common';
import { CreatePokeballDto } from './dto/create-pokeball.dto';
import { UpdatePokeballDto } from './dto/update-pokeball.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokeball } from './entities/pokeball.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PokeballsService {

  constructor(
    @InjectRepository(Pokeball)
    private readonly pokeballRepository: Repository<Pokeball>
  ){}

  async create(createPokeballDto: CreatePokeballDto) {
    return await this.pokeballRepository.save(createPokeballDto);
  }

  async findAll() {
    return await this.pokeballRepository.find();
  }

  async findOne(id: number) {
    return await this.pokeballRepository.findOneBy({id});
  }

  async update(id: number, updatePokeballDto: UpdatePokeballDto) {
    return await this.pokeballRepository.update(id, updatePokeballDto) ;
  }
}
