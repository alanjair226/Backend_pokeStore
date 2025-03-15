import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.cart, 
    { 
        onDelete: 'CASCADE',
        eager: true
    })
    @JoinColumn()
    user: User;

    @Column({ type: 'jsonb', default: [] })
    items: { pokemon_id: number, name: string, sprite: string, price: number, pokeball: string }[];
}
