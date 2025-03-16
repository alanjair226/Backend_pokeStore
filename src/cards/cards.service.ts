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

  // 🔹 Crear una tarjeta
  async create(createCardDto: CreateCardDto) {
    const user = await validate(createCardDto.user, 'id', this.userRepository);

    // 🔥 Buscar si ya existe una tarjeta con el mismo número y usuario (incluyendo soft deleted)
    const existingCard = await this.cardRepository.findOne({
        where: { card_number: createCardDto.card_number, user: { id: user.id } },
        withDeleted: true // 🔥 Incluye tarjetas eliminadas
    });

    if (existingCard) {
        if (existingCard.deletedAt) {
            // 🔥 Restaurar la tarjeta si estaba eliminada
            await this.cardRepository.restore(existingCard.id);
            return { message: "Tarjeta restaurada con éxito", card: existingCard };
        }
        return { message: "Ya existe una tarjeta con este número para el usuario", card: existingCard };
    }

    // 🔥 Si no existe, crear una nueva tarjeta
    const newCard = this.cardRepository.create({
        user,
        card_number: createCardDto.card_number,
        expiration_date: createCardDto.expiration_date,
        cardholder_name: createCardDto.cardholder_name
    });

    return await this.cardRepository.save(newCard);
}


  // 🔹 Obtener todas las tarjetas de un usuario
  async findAll(userId: number) {
    await validate(userId, 'id', this.userRepository);
    return await this.cardRepository.find({ where: { user: { id: userId } } });
  }

  // 🔹 Obtener una tarjeta específica
  async findOne(id: number) {
    return await validate(id, 'id', this.cardRepository);
  }

  // 🔹 Actualizar una tarjeta
  async update(id: number, updateCardDto: UpdateCardDto) {
    await validate(id, 'id', this.cardRepository);
    await this.cardRepository.update(id, updateCardDto);
    return this.findOne(id);
  }

  // 🔹 Eliminar una tarjeta (soft delete)
  async remove(id: number) {
    const card = await validate(id, 'id', this.cardRepository);
    await this.cardRepository.softRemove(card);
    return { message: "Tarjeta eliminada correctamente (soft delete)" };
  }

  // 🔹 Restaurar una tarjeta eliminada
  async restore(id: number) {
    await this.cardRepository.restore(id);
    return { message: "Tarjeta restaurada correctamente" };
  }
}
