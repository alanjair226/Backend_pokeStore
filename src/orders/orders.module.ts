import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CardsModule } from 'src/cards/cards.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CardsModule,
    CartModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [ TypeOrmModule]
})
export class OrdersModule {}
