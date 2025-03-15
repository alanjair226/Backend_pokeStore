import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { PokeballsModule } from './pokeballs/pokeballs.module';
import { OrdersModule } from './orders/orders.module';
import { CardsModule } from './cards/cards.module';
require('dotenv').config();

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CartModule,
    PokemonModule,
    PokeballsModule,
    OrdersModule,
    CardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
