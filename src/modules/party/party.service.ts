import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartyMember } from './entity/party-member.entity';
import { Party } from './entity/party.entity';
import { Thumbnail } from './entity/thumbnail.entity';

@Injectable()
export class PartyService {
    constructor(
        @InjectRepository(Party) private partyRepository: Repository<Party>,
        @InjectRepository(Thumbnail) private ThumbnailRepository: Repository<Thumbnail>,
        @InjectRepository(PartyMember) private PartyMembersRepository: Repository<PartyMember>,
      ) {}

      
}
