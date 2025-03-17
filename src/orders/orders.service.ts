import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Card } from 'src/cards/entities/card.entity';
import { validate } from 'common/utils/validation.utils';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(userId: number, cardId: number) {

    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
        throw new BadRequestException("Car is empty");
    }

    const card = await validate(cardId, 'id', this.cardRepository);

    const totalPrice = cart.items.reduce((sum, item) => sum + Number(item.price), 0);

    const orderItems = cart.items.map(cartItem => {
        return this.orderItemRepository.create({
            pokemon: cartItem.pokemon,
            pokeball: cartItem.pokeball,
            quantity: cartItem.quantity,
            price: cartItem.price,
        });
    });

    const order = this.orderRepository.create({
        user: cart.user,
        card,
        total_price: totalPrice,
        items: orderItems,
    });

    await this.orderRepository.save(order);
    await this.orderItemRepository.save(orderItems); 
    await this.cartService.clearCart(userId);

    return order;
}

  async findAll(userId: number) {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.pokemon', 'items.pokeball', 'card'],
    });
  }

  async findOne(orderId: number) {
    return await validate(orderId, 'id', this.orderRepository);
  }
}
