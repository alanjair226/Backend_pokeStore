import { Controller, Get, Post, Body, Param, UnauthorizedException, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enum/rol.enum';

@Auth([Role.ADMIN, Role.USER])
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req, @Body() body: { user: number, card: number }) {
    const loggedInUserId = req.user.userId; 

    if (loggedInUserId !== body.user) {
      throw new UnauthorizedException('you can not create an order to another user');
    }
    return this.ordersService.createOrder(body.user, body.card);
  }

  @Get(':userId')
  findAll(@Req() req, @Param('userId') userId: number) {
    const loggedInUserId = req.user.userId; 

    const userRole = req.user.role;

    if (userRole !== Role.ADMIN && loggedInUserId !== userId) {
      throw new UnauthorizedException('You cannot get orders from another user');
    }
    return this.ordersService.findAll(userId);
  }
  
  @Get('order/:id')
  async findOne(@Req() req, @Param('id') id: number) {
    const order = await this.ordersService.findOne(id)

    const loggedInUserId = req.user.userId; 
    const userRole = req.user.role;

    if (userRole !== Role.ADMIN && loggedInUserId !== order.user.id) {
      throw new UnauthorizedException('You cannot get orders from another user');
    }
    

    return this.ordersService.findOne(id);
  }
}
