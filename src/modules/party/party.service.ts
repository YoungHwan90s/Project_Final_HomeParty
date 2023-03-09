import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Tag } from '../tag/entity/tag.entity';
import { PartyMember } from './entity/party-member.entity';
import { PartyTagMapping } from './entity/party-tag-mapping.entity';
import { Thumbnail } from './entity/thumbnail.entity';
import { PartyRepository } from './party.repository';

@Injectable()
export class PartyService {
    constructor(
        private partyRepository: PartyRepository,
        @InjectRepository(PartyMember) private partyMembersRepository: Repository<PartyMember>,
        @InjectRepository(Thumbnail) private thumbnailsRepository: Repository<Thumbnail>,
        @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
        @InjectRepository(PartyTagMapping) private partyTagMapping: Repository<PartyTagMapping>,
    ) {}

    async getParties() {
        return await this.partyTagMapping.find({
            relations: ['tag', 'party', 'party.partyMember', 'party.thumbnail'],
            where: { party: { deletedAt: null } },
        });
    }

    async getPartyById(partyId: number) {
        return await this.partyTagMapping.findOne({
            relations: ['tag', 'party', 'party.partyMember', 'party.thumbnail'],
            where: { party: { id: partyId, deletedAt: null } },
        });
    }

    async createParty(party) {
        const saveParty = await this.partyRepository.save(party);

        await this.thumbnailsRepository.save({
            partyId: saveParty.id,
            thumbnail: saveParty.thumbnail,
        });

        const saveTag = await this.tagsRepository.save({
            partyId: saveParty.id,
            tagName: saveParty.tagName,
        });

        await this.partyTagMapping.save({
            partyId: saveParty.id,
            tagId: saveTag.id,
        });
    }

    async updateParty(userId, partyId, party) {
        const selectParty = await this.partyRepository.findOne({
            where: { id: partyId, deletedAt: null },
        });

        if (selectParty.hostId !== userId) {
            throw new ForbiddenException(`다른 사용자의 게시물은 삭제할 수 없습니다.`);
        }

        await this.partyRepository.update(partyId, {
            title: party.title,
            content: party.content,
            maxMember: party.maxMember,
            currMember: party.currMember,
            region: party.region,
            address: party.address,
            date: party.date,
        });
        await this.thumbnailsRepository.update(partyId, { thumbnail: party.thumbnail });
        await this.tagsRepository.update(partyId, { tagName: party.tagName });
    }

    // async applyParty(partyId: number, userId: number) {
    //     const party = await this.partyRepository.findOne({
    //         where: { id: partyId, deletedAt: null },
    //     });

    //     const result = await this.partyMembersRepository.insert({
    //         partyId,
    //         userId,
    //     });
    // }

    // async getPartyMembers(partyId: number) {
    //     return await this.partyMembersRepository.find({
    //         where: { partyId },
    //     });
    // }
    
    async deleteParty(partyId: number): Promise<DeleteResult> {
        return await this.partyRepository.delete(partyId);
    }

}
