import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Auth([Role.ADMIN])
  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get('pagination')
  async findAllPagination(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('category') category?: string
  ) {
    return this.pokemonService.findAllPagination(
      Number(page) || 1,
      Number(limit) || 20,
      type,
      category
    );
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(+id);
  }

  @Auth([Role.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(+id, updatePokemonDto);
  }
}
