import { Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.cart, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, eager: true })
    items: CartItem[];
}
