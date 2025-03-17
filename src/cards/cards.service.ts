import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { validate } from 'common/utils/validation.utils';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const user = await validate(createCardDto.user, 'id', this.userRepository);

    const existingCard = await this.cardRepository.findOne({
        where: { card_number: createCardDto.card_number, user: { id: user.id } },
        withDeleted: true 
    });

    if (existingCard) {
        if (existingCard.deletedAt) {
            await this.cardRepository.restore(existingCard.id);
            return { message: "Card successfully restored", card: existingCard };
        }
        return { message: "A card with this number already exists for the user", card: existingCard };
    }

    const newCard = this.cardRepository.create({
        user,
        card_number: createCardDto.card_number,
        expiration_date: createCardDto.expiration_date,
        cardholder_name: createCardDto.cardholder_name
    });

    return await this.cardRepository.save(newCard);
  }

  async findAll(userId: number) {
    await validate(userId, 'id', this.userRepository);
    return await this.cardRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number) {
    return await validate(id, 'id', this.cardRepository);
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    await validate(id, 'id', this.cardRepository);
    await this.cardRepository.update(id, updateCardDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const card = await validate(id, 'id', this.cardRepository);
    await this.cardRepository.softRemove(card);
    return { message: "Card successfully deleted (soft delete)" };
  }

  async restore(id: number) {
    await this.cardRepository.restore(id);
    return { message: "Card successfully restored" };
  }
}
