import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from "class-validator";

export class CreatePokemonDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    sprite: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    types: string[];

    @IsNotEmpty()
    @IsNumber()
    base_price: number;
}

