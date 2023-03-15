import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyMember } from './entity/party-member.entity';
import { PartyController } from './party.controller';
import { Party } from './entity/party.entity';
import { PartyService } from './party.service';
import { Thumbnail } from './entity/thumbnail.entity';
import { AuthModule } from '../auth/auth.module';
import { Tag } from './entity/tag.entity';
import { User } from '../user/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Party, User]),
        AuthModule,
    ],
    controllers: [PartyController],
    providers: [PartyService],
})
export class PartyModule {}
