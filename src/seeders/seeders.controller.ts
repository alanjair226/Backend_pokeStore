import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Auth([Role.ADMIN, Role.USER])
@Controller('seeders')
export class SeedersController {
  constructor(private readonly seedersService: SeedersService) {}

  @Post('/pokeballs')
  pokeballSeeder() {
    return this.seedersService.pokeballSeeder();
  }

  @Post('/pokemons')
  pokemonSeeder() {
    return this.seedersService.pokemonSeeder();
  }


}
