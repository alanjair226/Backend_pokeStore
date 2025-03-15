import { Column, DeleteDateColumn, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "src/cart/entities/cart.entity";
import { Order } from "src/orders/entities/order.entity";
import { Card } from "src/cards/entities/card.entity";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ nullable:false })
    password: string;

    @Column({ unique: true, nullable:false })
    email: string;

    @Column({ default: 'user' })
    role: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => Cart, cart => cart.user)
    cart: Cart;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Card, card => card.user)
    cards: Card[];
}
