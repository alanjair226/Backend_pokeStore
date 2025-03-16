import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Card {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.cards, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    card_number: string;

    @Column()
    expiration_date: string;

    @Column()
    cardholder_name: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}
