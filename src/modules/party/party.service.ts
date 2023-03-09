import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository } from 'typeorm';
import { Tag } from '../tag/entity/tag.entity';
import { User } from '../user/entity/user.entity';
import { PartyMember } from './entity/party-member.entity';
import { PartyTagMapping } from './entity/party-tag-mapping.entity';
import { Party } from './entity/party.entity';
import { Thumbnail } from './entity/thumbnail.entity';

@Injectable()
export class PartyService {
    constructor(
        @InjectRepository(Party) private partyRepository: Repository<Party>,
        @InjectRepository(PartyMember) private partyMemberRepository: Repository<PartyMember>,
        @InjectRepository(Thumbnail) private thumbnailRepository: Repository<Thumbnail>,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(PartyTagMapping) private partyTagMapping: Repository<PartyTagMapping>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async getParties() {
        return await this.partyRepository.find({
            relations: ['thumbnail', 'wishList'],
            where: { wishList: {} },
        });
    }

    async getPartyById(partyId: number) {
        return await this.partyRepository.findOne({
            relations: ['thumbnail', 'partyMember', 'partyTagMapping.tag', 'wishList'],
            where: { id: partyId },
        });
    }

    // async createParty(party) {
    //     const saveParty = await this.partyRepository.save(party);

    //     await this.thumbnailsRepository.save({
    //         partyId: saveParty.id,
    //         thumbnail: saveParty.thumbnail,
    //     });

    //     const saveTag = await this.tagsRepository.save({
    //         partyId: saveParty.id,
    //         tagName: saveParty.tagName,
    //     });

    //     await this.partyTagMapping.save({
    //         partyId: saveParty.id,
    //         tagId: saveTag.id,
    //     });
    // }

    async createParty(user: User, partyInfo) {
        const party = new Party();
        party.hostId = user.id;
        party.title = partyInfo.title;
        party.content = partyInfo.content;
        party.maxMember = partyInfo.maxMember;
        party.currMember = partyInfo.currMember;
        party.region = partyInfo.region;
        party.address = partyInfo.address;
        party.date = partyInfo.date;

        const newParty = await this.partyRepository.save(party);

        if (partyInfo.thumbnail) {
            const thumbnail = new Thumbnail();
            thumbnail.party = newParty;
            thumbnail.thumbnail = partyInfo.thumbnail;
            await this.thumbnailRepository.save(thumbnail);
        }

        if (partyInfo.tagName) {
            const tag = new Tag();
            tag.tagName = partyInfo.tagName;
            await this.tagRepository.save(tag);

            const tagMapping = new PartyTagMapping();
            tagMapping.party = newParty;
            tagMapping.tag = tag;
            await this.partyTagMapping.save(tagMapping);
        }

        const partyMember = new PartyMember();
        partyMember.party = newParty;
        partyMember.user = user;
        partyMember.status = '호스트';
        await this.partyMemberRepository.save(partyMember);
    }

    async updateParty(userId, partyId, partyInfo) {
        const party = await this.partyRepository.findOne({
            where: { id: partyId, deletedAt: null },
        });

        if (party.hostId !== userId) {
            throw new ForbiddenException(`다른 사용자의 게시물은 수정할 수 없습니다.`);
        }

        await this.partyRepository.update(partyId, partyInfo);

        if (party.thumbnail) {
            party.thumbnail[0].thumbnail = partyInfo.thumbnail;
        }

        if (!party.thumbnail) {
            const thumbnail = new Thumbnail();
            thumbnail.party = party;
            thumbnail.thumbnail = partyInfo.thumbnail;
            await this.thumbnailRepository.save(thumbnail);
        }
    }
    // async updateParty(userId, partyId, party) {
    //     const selectParty = await this.partyRepository.findOne({
    //         where: { id: partyId, deletedAt: null },
    //     });

    //     if (selectParty.hostId !== userId) {
    //         throw new ForbiddenException(`다른 사용자의 게시물은 수정할 수 없습니다.`);
    //     }

    //     await this.partyRepository.update(partyId, {
    //         title: party.title,
    //         content: party.content,
    //         maxMember: party.maxMember,
    //         currMember: party.currMember,
    //         region: party.region,
    //         address: party.address,
    //         date: party.date,
    //     });

    //     await this.thumbnailsRepository.update(partyId, {
    //         thumbnail: party.thumbnail,
    //     });
    // }

    async applyParty(user: User, partyId: number) {
        const existingPartyMember = await this.partyMemberRepository.findOne({
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

        return await this.partyMemberRepository.save(partyMember);
    }

    async getPartyMembers(partyId: number) {
        return await this.partyMemberRepository.find({
            where: { partyId },
        });
    }

    async cancelParty(partyId: number, userId: number) {
        const existingParty = await this.partyMemberRepository.findOne({
            where: { partyId, userId },
        });

        if (!existingParty) {
            throw new Error(`신청하지 않은 파티입니다.`);
        }
        console.log(existingParty.userId);
        return await this.partyMemberRepository.delete(existingParty.userId);
    }

    async acceptMember(partyId: number, userId: number) {
        return await this.updateStatus(partyId, userId, '신청완료');
    }

    async rejectMember(partyId: number, userId: number) {
        return await this.updateStatus(partyId, userId, '거절');
    }

    private async updateStatus(partyId: number, userId: number, status: string) {
        const partyMember = await this.partyMemberRepository.findOne({
            where: { partyId, userId },
        });
        if (!partyMember) {
            throw new NotFoundException('해당 유저가 존재하지 않습니다.');
        }
        partyMember.status = status;
        return await this.partyMemberRepository.save(partyMember);
    }

    async deleteParty(partyId: number): Promise<DeleteResult> {
        return await this.partyRepository.delete(partyId);
    }
}
