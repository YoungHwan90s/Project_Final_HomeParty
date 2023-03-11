import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tag } from './entity/party-tag.entity';
import { User } from '../user/entity/user.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
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
        private readonly dataSource: DataSource,
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

    async createParty(user: User, partyInfo: CreatePartyDto): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const party = new Party();
            party.hostId = user.id;
            party.title = partyInfo.title;
            party.content = partyInfo.content;
            party.maxMember = partyInfo.maxMember;
            party.region = partyInfo.region;
            party.address = partyInfo.address;
            party.date = partyInfo.date;

            const newParty = await queryRunner.manager.save(party);

            if (partyInfo.thumbnail.length) {
                for (let i = 0; i < partyInfo.thumbnail.length; i++) {
                    const thumbnail = new Thumbnail();
                    thumbnail.party = newParty;
                    thumbnail.thumbnail = partyInfo.thumbnail[i];

                    await queryRunner.manager.save(thumbnail);
                }
            }

            if (partyInfo.tagName.length) {
                for (let i = 0; i < partyInfo.tagName.length; i++) {
                    const tag = new Tag();
                    tag.tagName = partyInfo.tagName[i];

                    await queryRunner.manager.save(tag);

                    const tagMapping = new PartyTagMapping();
                    tagMapping.party = newParty;
                    tagMapping.tag = tag;
                    await queryRunner.manager.save(tagMapping);
                }
            }

            const partyMember = new PartyMember();
            partyMember.party = newParty;
            partyMember.user = user;
            partyMember.status = '호스트';

            await queryRunner.manager.save(partyMember);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotFoundException('신청하신 파티가 삭제되었거나 존재하지 않습니다.');
        } finally {
            await queryRunner.release();
        }
    }

    async updateParty(userId: number, partyId: number, partyInfo: UpdatePartyDto) {
        const party = await this.partyRepository.findOne({
            relations: { thumbnail: true, partyTagMapping: { tag: true } },
            where: { id: partyId },
        });

        party.title = partyInfo.title;
        party.content = partyInfo.content;
        party.title = partyInfo.title;
        party.region = partyInfo.region;
        party.address = partyInfo.address;
        party.date = partyInfo.date;

        for (let i = 0; i < party.thumbnail.length; i++) {
            partyInfo.thumbnail[i];
        }

        // await this.partyRepository.save(party);

        console.dir(party, { depth: null });

        // if (party.hostId !== userId) {
        //     throw new ForbiddenException(`다른 사용자의 게시물은 수정할 수 없습니다.`);
        // }

        // party.title = partyInfo.title;
        // party.content = partyInfo.content;
        // party.maxMember = partyInfo.maxMember;
        // party.region = partyInfo.region;
        // party.address = partyInfo.address;
        // party.date = partyInfo.date;

        // this.partyRepository.save(party);
    }

    async applyParty(user: User, partyId: number) {
        const existingPartyMember = await this.partyMemberRepository.findOneOrFail({
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

    async cancelParty(userId: number, partyId: number) {
        const partyMember = await this.partyMemberRepository.findOne({
            where: { partyId, userId },
        });

        if (!partyMember) {
            throw new Error(`신청하지 않은 파티입니다.`);
        }

        return await this.partyMemberRepository.softRemove(partyMember);
    }

    async acceptMember(partyId: number, userId: number, status) {
        const partyMember = await this.partyMemberRepository.findOne({
            where: { partyId, userId },
        });
        const party = await this.partyRepository.findOne({
            where: { id: partyId },
        });

        if (!partyMember) {
            throw new NotFoundException('해당 유저가 존재하지 않습니다.');
        }

        if (status === '신청승낙') {
            partyMember.status = '신청승낙';
            party.currMember += 1;
            return await this.partyMemberRepository.save(partyMember);
        }

        if (status === '거절') {
            partyMember.status = '거절';
            party.currMember -= 1;
            return await this.partyMemberRepository.save(partyMember);
        }
    }

    async deleteParty(userId: number, partyId: number) {
        const party = await this.partyRepository.findOne({
            where: { id: partyId },
            relations: ['wishList', 'partyMember', 'review', 'partyTagMapping', 'thumbnail'],
        });

        if (party.hostId !== userId) {
            throw new ForbiddenException(`해당 호스트만 삭제가 가능합니다.`);
        }

        return this.partyRepository.softRemove(party);
    }
}
