import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    cardholder_name: string;

    @Column()
    expiration_date: string;

    @Column()
    cvv: string;
}
