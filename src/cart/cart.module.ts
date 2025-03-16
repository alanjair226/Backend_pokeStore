import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { CartItem } from './entities/cart-item.entity';
import { PokeballsModule } from 'src/pokeballs/pokeballs.module';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    UsersModule,
    PokeballsModule,
    PokemonModule
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [TypeOrmModule, CartService]
})
export class CartModule {}
