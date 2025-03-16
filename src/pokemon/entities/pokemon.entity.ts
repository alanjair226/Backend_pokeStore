import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ default: "normal" })
    category: string; 
}
