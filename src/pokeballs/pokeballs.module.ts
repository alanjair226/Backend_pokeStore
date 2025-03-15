import { Module } from '@nestjs/common';
import { PokeballsService } from './pokeballs.service';
import { PokeballsController } from './pokeballs.controller';
import { Pokeball } from './entities/pokeball.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokeball])
  ],
  controllers: [PokeballsController],
  providers: [PokeballsService],
  exports: [TypeOrmModule]
})
export class PokeballsModule {}
