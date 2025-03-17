import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Pokemon } from "src/pokemon/entities/pokemon.entity";
import { Pokeball } from "src/pokeballs/entities/pokeball.entity";

@Entity()
export class OrderItem {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE'})
    order: Order;

    @ManyToOne(() => Pokemon, { eager: true })
    pokemon: Pokemon;

    @ManyToOne(() => Pokeball, { eager: true })
    pokeball: Pokeball;

    @Column({ default: 1 })
    quantity: number; 

    @Column({ type: "decimal" })
    price: number;
}
