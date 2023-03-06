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

    async deleteParty(id: number, partyId: number) {
      //지금 로그인되어있는 유저id와 삭제하려는 파티id를 파티테이블에서 조회하고 
      //있으면 그걸 softdelete 하셈 없으면 error 뜨게해
      return await this.partyRepository.softDelete(partyId);

      
    }
      
}
