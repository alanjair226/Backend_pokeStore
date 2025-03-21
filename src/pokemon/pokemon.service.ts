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
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    return await this.pokemonRepository.save(createPokemonDto);
  }

  async findAll() {
    return await this.pokemonRepository.find();
  }

  async findAllPagination(
    page: number,
    limit: number,
    type?: string,
    category?: string,
    search?: string 
  ) {
    if (page < 1) page = 1;
    if (limit < 1) limit = 20;
  
    const query = this.pokemonRepository.createQueryBuilder("pokemon");
  
    if (type) {
      query.andWhere(":type = ANY (pokemon.types)", { type });
    }
  
    if (category) {
      query.andWhere("pokemon.category = :category", { category });
    }
    
    // If search is provided, filter by name using a case-insensitive match
    if (search) {
      query.andWhere("pokemon.name ILIKE :search", { search: `%${search}%` });
    }

    query.orderBy("pokemon.id", "ASC");
  
    const [pokemons, total] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
  
    return {
      data: pokemons,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };
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
