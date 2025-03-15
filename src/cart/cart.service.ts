import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { validate } from 'common/utils/validation.utils';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ){}

  async create(createCartDto: CreateCartDto) {

    const user = await validate(createCartDto.user, 'id', this.userRepository);
    const newCart = this.cartRepository.create({ user, items: [] });
    
    return await this.cartRepository.save(newCart);
  
  }

  findAll() {
    return this.cartRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
