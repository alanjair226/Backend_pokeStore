import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: number) {
    return this.cardsService.findAll(userId);
  }

  @Get('card/:id')
  findOne(@Param('id') id: number) {
    return this.cardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cardsService.remove(id);
  }
}
