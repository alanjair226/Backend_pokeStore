import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Pokemon } from "src/pokemon/entities/pokemon.entity";
import { Pokeball } from "src/pokeballs/entities/pokeball.entity";

@Entity()
export class CartItem {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Pokemon, { eager: true })
    pokemon: Pokemon;

    @ManyToOne(() => Pokeball, { eager: true })
    pokeball: Pokeball;

    @Column({ type: "decimal" })
    price: number;
}
