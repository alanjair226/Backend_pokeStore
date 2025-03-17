import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Pokeball } from 'src/pokeballs/entities/pokeball.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { validate } from 'common/utils/validation.utils';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
        @InjectRepository(Pokemon) private readonly pokemonRepository: Repository<Pokemon>,
        @InjectRepository(Pokeball) private readonly pokeballRepository: Repository<Pokeball>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async create(createCartDto: CreateCartDto) {
        const user = await validate(createCartDto.user, 'id', this.userRepository);
        const newCart = this.cartRepository.create({ user, items: [] });
        return await this.cartRepository.save(newCart);
    }

    async getCart(userId: number) {
        return await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.pokemon', 'items.pokeball'],
        });
    }

    findAll() {
        return this.cartRepository.find();
    }

    async addToCart(userId: number, pokemonId: number, pokeballId?: number, quantity: number = 1) {
        const cart = await this.getCart(userId);
        const pokemon = await validate(pokemonId, 'id', this.pokemonRepository);
        const pokeball = pokeballId
            ? await validate(pokeballId, 'id', this.pokeballRepository)
            : await this.pokeballRepository.findOne({ where: { name: 'poke-ball' } });

        const calculatedPrice = parseFloat((pokemon.base_price * pokeball.catch_rate_multiplier).toFixed(2));

        let cartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, pokemon: { id: pokemon.id }, pokeball: { id: pokeball.id } }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem.price = cartItem.quantity * calculatedPrice;
        } else {
            cartItem = this.cartItemRepository.create({
                cart,
                pokemon,
                pokeball,
                quantity,
                price: quantity * calculatedPrice
            });
        }

        await this.cartItemRepository.save(cartItem);
        return cartItem;
    }

    async removeFromCart(userId: number, cartItemId: number) {
        const cartItem = await validate(cartItemId, 'id', this.cartItemRepository);

        if (cartItem.cart.user.id !== userId) {
            throw new NotFoundException('Item no pertenece al usuario');
        }

        await this.cartItemRepository.remove(cartItem);
        return { message: 'Item deleted' };
    }

    async clearCart(userId: number) {
        const cart = await this.getCart(userId);

        if (cart.items.length > 0) {
            await this.cartItemRepository.remove(cart.items);
        }

        return { message: 'Cart empty' };
    }

    async updateCartItem(userId: number, cartItemId: number, newQuantity?: number, newPokeballId?: number) {
        const cartItem = await validate(cartItemId, 'id', this.cartItemRepository);

        if (cartItem.cart.user.id !== userId) {
            throw new NotFoundException('Item does not belong to user');
        }

        if (newQuantity !== undefined && newQuantity < 1) {
            await this.cartItemRepository.remove(cartItem);
            return { message: 'Item deleted' };
        }

        if (newPokeballId) {
            cartItem.pokeball = await validate(newPokeballId, 'id', this.pokeballRepository);
        }

        if (newQuantity !== undefined) {
            cartItem.quantity = newQuantity;
        }

        const basePrice = Number(cartItem.pokemon.base_price);
        const catchRateMultiplier = Number(cartItem.pokeball.catch_rate_multiplier);
        cartItem.price = cartItem.quantity * basePrice * catchRateMultiplier;

        await this.cartItemRepository.save(cartItem);
        return cartItem;
    }
}
