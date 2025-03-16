import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs'
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt'
import { CartService } from 'src/cart/cart.service';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly cartService: CartService,
        private readonly jwtService: JwtService
    ){}

    async register({username, email, password}: RegisterDto){

        const user =  await this.usersService.findOneByEmail(email)

        if(user){
            throw new BadRequestException("User already exists")
        }

        const registeredUser = await this.usersService.create({
            username,
            email,
            password: await bcryptjs.hash(password, 10)
        });

        await this.cartService.create({ user: registeredUser.id})

        return {
            registeredUser
        }
    }
    
    async login({email, password}:LoginDto){

        const user =  await this.usersService.findOneByEmail(email)
        

        if(!user){
            throw new UnauthorizedException('email is wrong') 
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)

        if(!isPasswordValid){
            throw new UnauthorizedException('password is wrong')
        }

        const payload = {userId: user.id, email: user.email, role: user.role}

        const token = await this.jwtService.signAsync(payload)

        return {token, email};
    }

}
