import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePokeballDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    sprite: string;

    @IsOptional()
    @IsNumber()
    catch_rate_multiplier: number;
}
