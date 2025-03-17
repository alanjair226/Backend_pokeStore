import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Auth([Role.ADMIN, Role.USER])
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: { user: number, card: number }) {
    return this.ordersService.createOrder(body.user, body.card);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: number) {
    return this.ordersService.findAll(userId);
  }

  @Get('order/:id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }
}
