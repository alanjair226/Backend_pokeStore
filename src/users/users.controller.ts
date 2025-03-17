import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth([Role.ADMIN])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth([Role.ADMIN, Role.USER])
  @Get(':id')
  findOne(@Req() req, @Param('id') id: number) {
    const loggedInUserId = req.user.userId;
    const userRole = req.user.role;

    if (userRole !== Role.ADMIN && loggedInUserId !== id) {
      throw new UnauthorizedException('you can not get another user');
    }
    return this.usersService.findOne(id);
  }

  @Auth([Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
