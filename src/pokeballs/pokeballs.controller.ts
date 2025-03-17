import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PokeballsService } from './pokeballs.service';
import { CreatePokeballDto } from './dto/create-pokeball.dto';
import { UpdatePokeballDto } from './dto/update-pokeball.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Controller('pokeballs')
export class PokeballsController {
  constructor(private readonly pokeballsService: PokeballsService) {}

  @Auth([Role.ADMIN,])
  @Post()
  create(@Body() createPokeballDto: CreatePokeballDto) {
    return this.pokeballsService.create(createPokeballDto);
  }

  @Auth([Role.ADMIN, Role.USER])
  @Get()
  findAll() {
    return this.pokeballsService.findAll();
  }

  @Auth([Role.ADMIN, Role.USER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokeballsService.findOne(+id);
  }

  @Auth([Role.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokeballDto: UpdatePokeballDto) {
    return this.pokeballsService.update(+id, updatePokeballDto);
  }

}
