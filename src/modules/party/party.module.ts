import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyMember } from './entity/party-member.entity';
import { PartyController } from './party.controller';
import { Party } from './entity/party.entity';
import { PartyService } from './party.service';
import { Thumbnail } from './entity/thumbnail.entity';
import { PartyTagMapping } from './entity/party-tag-mapping.entity';
import { AuthModule } from '../auth/auth.module';
import { PartyRepository } from './party.repository';
import { Tag } from '../tag/entity/tag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Party, Thumbnail, PartyMember, PartyTagMapping, Tag]),
        AuthModule,
    ],
    controllers: [PartyController],
    providers: [PartyService, PartyRepository],
})
export class PartyModule {}
