import { IsNotEmpty, IsString, IsNumber, Length } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateCardDto {

    @IsNotEmpty()
    @IsNumber()
    user: User;

    @IsNotEmpty()
    @IsString()
    @Length(16, 16, { message: 'Card number must be 16 digits' })
    card_number: string;

    @IsNotEmpty()
    @IsString()
    expiration_date: string;

    @IsNotEmpty()
    @IsString()
    cardholder_name: string;
}