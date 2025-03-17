import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

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
