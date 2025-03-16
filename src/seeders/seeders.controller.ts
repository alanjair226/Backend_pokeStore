import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedersService } from './seeders.service';

@Controller('seeders')
export class SeedersController {
  constructor(private readonly seedersService: SeedersService) {}

  @Post('')
  hola() {
    return {message: 'seeders'};
  }

  @Post('/pokeballs')
  pokeballSeeder() {
    return this.seedersService.pokeballSeeder();
  }

  @Post('/pokemons')
  pokemonSeeder() {
    return this.seedersService.pokemonSeeder();
  }


}
