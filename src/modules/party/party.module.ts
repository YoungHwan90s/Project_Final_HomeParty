import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyMember } from './entity/party-member.entity';
import { PartyController } from './party.controller';
import { Party } from './entity/party.entity';
import { PartyService } from './party.service';
import { AuthModule } from '../auth/auth.module';
import { CacheService } from 'src/util/cache/cache.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Party, PartyMember]),
        AuthModule,
    ],
    controllers: [PartyController],
    providers: [PartyService, CacheService],
    exports: [PartyService],
})
export class PartyModule {}
