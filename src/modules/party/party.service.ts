import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository } from 'typeorm';
import { Tag } from '../tag/entity/tag.entity';
import { User } from '../user/entity/user.entity';
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
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async getParties() {
        return await this.partyTagMapping.find({
            relations: ['tag', 'party', 'party.partyMember', 'party.thumbnail'],
            where: { party: { deletedAt: null } },
        });
    }

    async getPartyById(partyId: number) {
        return await this.partyRepository.findOne({
            relations: ['thumbnail', 'partyMember', 'partyTagMapping.tag'],
            where: { id: partyId },
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
            throw new ForbiddenException(`다른 사용자의 게시물은 수정할 수 없습니다.`);
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

        const result = await this.thumbnailsRepository.update(partyId, {
            thumbnail: party.thumbnail,
        });

        console.log(result);
        // await this.tagsRepository.update(partyId, { tagName: party.tagName });
    }

    async applyParty(user: User, partyId: number) {
        const existingPartyMember = await this.partyMembersRepository.findOne({
            where: { userId: user.id },
        });

        if (existingPartyMember) {
            throw new Error(`이미 신청하셨습니다.`);
        }

        const party = await this.partyRepository.findOne({
            where: { id: partyId },
        });

        if (!party) {
            throw new NotFoundException('신청하신 파티가 삭제되었거나 존재하지 않습니다.');
        }

        const partyMember = new PartyMember();
        partyMember.user = user;
        partyMember.party = party;

        return await this.partyMembersRepository.save(partyMember);
    }

    async getPartyMembers(partyId: number) {
        return await this.partyMembersRepository.find({
            where: { partyId },
        });
    }

    async cancelParty(partyId: number, userId: number) {
        const existingParty = await this.partyMembersRepository.findOne({
            where: { partyId, userId },
        });

        if (!existingParty) {
            throw new Error(`신청하지 않은 파티입니다.`);
        }

        return await this.partyMembersRepository.softDelete(userId);
    }

    async acceptMember(partyId: number, userId: number) {
        return await this.updateStatus(partyId, userId, '신청완료');
    }

    async rejectMember(partyId: number, userId: number) {
        return await this.updateStatus(partyId, userId, '거절');
    }

    private async updateStatus(partyId: number, userId: number, status: string) {
        const partyMember = await this.partyMembersRepository.findOne({
            where: { partyId, userId },
        });
        if (!partyMember) {
            throw new NotFoundException('해당 유저가 존재하지 않습니다.');
        }
        partyMember.status = status;
        return await this.partyMembersRepository.save(partyMember);
    }

    async deleteParty(partyId: number): Promise<DeleteResult> {
        return await this.partyRepository.delete(partyId);
    }
}
