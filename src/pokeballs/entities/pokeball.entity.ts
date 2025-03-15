import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pokeball {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    sprite: string;

    @Column({ type: "decimal", default: 1.0 })
    catch_rate_multiplier: number;
}
