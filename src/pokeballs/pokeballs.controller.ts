import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PokeballsService } from './pokeballs.service';
import { CreatePokeballDto } from './dto/create-pokeball.dto';
import { UpdatePokeballDto } from './dto/update-pokeball.dto';

@Controller('pokeballs')
export class PokeballsController {
  constructor(private readonly pokeballsService: PokeballsService) {}

  @Post()
  create(@Body() createPokeballDto: CreatePokeballDto) {
    return this.pokeballsService.create(createPokeballDto);
  }

  @Get()
  findAll() {
    return this.pokeballsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokeballsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokeballDto: UpdatePokeballDto) {
    return this.pokeballsService.update(+id, updatePokeballDto);
  }

}
