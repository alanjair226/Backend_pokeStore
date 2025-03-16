import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { SeedersController } from './seeders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Pokeball } from 'src/pokeballs/entities/pokeball.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Pokemon, Pokeball])
  ],
  controllers: [SeedersController],
  providers: [SeedersService],
})
export class SeedersModule {}
