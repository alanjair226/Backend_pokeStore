import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Card } from 'src/cards/entities/card.entity';
import { validate } from 'common/utils/validation.utils';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly cartService: CartService, // 🔥 Inyectamos CartService en lugar de usar cartItemRepository
  ) {}

  // 🔹 Crear una nueva orden
  async createOrder(userId: number, cardId: number) {
    const cart = await this.cartService.getCart(userId); // 🔥 Usamos CartService para obtener el carrito

    if (!cart || cart.items.length === 0) {
        throw new BadRequestException("El carrito está vacío");
    }

    const card = await validate(cardId, 'id', this.cardRepository);

    // 🔥 Calcular el total de la compra
    const totalPrice = cart.items.reduce((sum, item) => sum + Number(item.price), 0);

    // 🔥 Transferir los items del carrito a la orden antes de guardarla
    const orderItems = cart.items.map(cartItem => {
        return this.orderItemRepository.create({
            pokemon: cartItem.pokemon,
            pokeball: cartItem.pokeball,
            quantity: cartItem.quantity,
            price: cartItem.price,
        });
    });

    // 🔥 Crear la orden con los items ya incluidos
    const order = this.orderRepository.create({
        user: cart.user,
        card,
        total_price: totalPrice,
        items: orderItems, // 🔥 Agregamos los OrderItem directamente antes de guardar
    });

    await this.orderRepository.save(order);
    await this.orderItemRepository.save(orderItems); // 🔥 Guardamos los OrderItem

    // 🔥 Llamamos a CartService para vaciar el carrito
    await this.cartService.clearCart(userId);

    return order;
}


  // 🔹 Obtener todas las órdenes de un usuario
  async findAll(userId: number) {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.pokemon', 'items.pokeball', 'card'],
    });
  }

  // 🔹 Obtener una orden específica
  async findOne(orderId: number) {
    return await validate(orderId, 'id', this.orderRepository);
  }
}
