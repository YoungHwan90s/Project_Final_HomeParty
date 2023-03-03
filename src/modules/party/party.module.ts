import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyController } from './party.controller';
import { Party } from './party.entity';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([Party])],
  controllers: [PartyController],
  providers: [PartyService]
})
export class PartyModule {}
