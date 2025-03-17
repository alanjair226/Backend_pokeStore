import { Body, Controller, Get, Post, Delete, Param, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Auth([Role.ADMIN, Role.USER])
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get(':userId')
    async getCart(@Param('userId') userId: number) {
        return this.cartService.getCart(userId);
    }

    @Post('add')
    async addToCart(@Body() body: { userId: number, pokemonId: number, pokeballId?: number, quantity?: number }) {
        return this.cartService.addToCart(body.userId, body.pokemonId, body.pokeballId, body.quantity || 1);
    }

    @Patch('update-item')
async updateCartItem(@Body() body: { userId: number, cartItemId: number, newQuantity?: number, newPokeballId?: number }) {
    return this.cartService.updateCartItem(body.userId, body.cartItemId, body.newQuantity, body.newPokeballId);
}

    @Delete('remove')
    async removeFromCart(@Body() body: { userId: number, cartItemId: number }) {
        return this.cartService.removeFromCart(body.userId, body.cartItemId);
    }

    @Delete('clear/:userId')
    async clearCart(@Param('userId') userId: number) {
        return this.cartService.clearCart(userId);
    }
}
