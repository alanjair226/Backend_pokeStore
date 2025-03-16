import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    return await this.pokemonRepository.save(createPokemonDto);
  }

  async findAll() {
    return await this.pokemonRepository.find();
  }

  async findOne(id: number) {
    return await this.pokemonRepository.findOneBy({ id });
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return await this.pokemonRepository.update(id, updatePokemonDto);
  }

  async remove(id: number) {
    return await this.pokemonRepository.delete(id);
  }
}
