import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyMember } from './entity/party-member.entity';
import { PartyController } from './party.controller';
import { Party } from './entity/party.entity';
import { PartyService } from './party.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Party, PartyMember, User]),
        AuthModule,
    ],
    controllers: [PartyController],
    providers: [PartyService],
})
export class PartyModule {}
