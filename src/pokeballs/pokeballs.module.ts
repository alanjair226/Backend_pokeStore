import { Module } from '@nestjs/common';
import { PokeballsService } from './pokeballs.service';
import { PokeballsController } from './pokeballs.controller';

@Module({
  controllers: [PokeballsController],
  providers: [PokeballsService],
})
export class PokeballsModule {}
