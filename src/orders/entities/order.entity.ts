import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'jsonb', default: [] })
    items: { pokemon_id: number, name: string, sprite: string, price: number, pokeball: string }[];

    @Column({ type: "decimal" })
    total_price: number;

    @CreateDateColumn()
    createdAt: Date;
}
