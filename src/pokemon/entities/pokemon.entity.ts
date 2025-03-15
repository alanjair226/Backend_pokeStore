import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pokeball } from "src/pokeballs/entities/pokeball.entity";

@Entity()
export class Pokemon {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sprite: string;

    @Column("text", { array: true })
    types: string[];

    @Column({ type: "decimal" })
    base_price: number;

    @ManyToOne(() => Pokeball, { nullable: false })
    pokeball: Pokeball;

    @Column({ type: "decimal" })
    final_price: number;
}
