import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { Card } from "src/cards/entities/card.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @ManyToOne(() => Card, { nullable: false })
    card: Card;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column({ type: "decimal" })
    total_price: number;
    
    @CreateDateColumn()
    createdAt: Date;
}
