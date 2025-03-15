import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from 'src/cart/cart.module';


@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn: '1d'}
    }),
    UsersModule,
    CartModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
