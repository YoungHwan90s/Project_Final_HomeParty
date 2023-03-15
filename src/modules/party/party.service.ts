import {
    ForbiddenException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { User } from '../user/entity/user.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartyMember } from './entity/party-member.entity';
import { Party } from './entity/party.entity';
import { Thumbnail } from './entity/thumbnail.entity';
import { WishList } from '../user/entity/wish-list.entity';

@Injectable()
export class PartyService {
    constructor(
        @InjectRepository(Party) private partyRepository: Repository<Party>,
        @InjectRepository(PartyMember) private partyMemberRepository: Repository<PartyMember>,
        private readonly dataSource: DataSource,
    ) {}

    async getParties(): Promise<Party[]> {
        return await this.partyRepository.find({
            where: {deletedAt: null},
            relations: ['thumbnail'],
        });
    }

    async getPartyById(partyId: number) {
        return await this.partyRepository.findOne({
            relations: ['thumbnail', 'partyMember', 'tag', 'wishList'],
            where: { id: partyId, deletedAt: null },
        });
    }

    async createParty(user: User, partyInfo: CreatePartyDto): Promise<Party> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let createdParty;

        try {
            // Party 객체 인스턴스 맵핑
            const party = new Party();
            party.user = user;
            party.hostId = user.id;
            party.title = partyInfo.title;
            party.content = partyInfo.content;
            party.maxMember = partyInfo.maxMember;
            party.address = partyInfo.address;
            party.date = partyInfo.date;

            if (partyInfo.tagName?.length) {
                let newTags = [];
                for (let i = 0; i < partyInfo.tagName.length; i++) {
                    let tag = await queryRunner.manager.findOne(Tag, {
                        where: {
                            tagName: partyInfo.tagName[i],
                        },
                    });
                    if (tag) {
                        tag.freq += 1;
                    }
                    if (!tag) {
                        tag = new Tag();
                        tag.tagName = partyInfo.tagName[i];
                    }
                    newTags.push(tag);
                }

                // Tag 객체 인스턴스 맵핑
                party.tag = newTags;
            }

            if (partyInfo.thumbnail?.length) {
                let newThumbnails = [];
                for (let i = 0; i < partyInfo.thumbnail.length; i++) {
                    let thumbnail = new Thumbnail();
                    thumbnail.thumbnail = partyInfo.thumbnail[i];
                    newThumbnails.push(thumbnail);
                }
                // Thumbnail 객체 인스턴스 맵핑
                party.thumbnail = newThumbnails;
            }

            // PartyMember 객체 인스턴스 맵핑
            const partyMember = new PartyMember();
            partyMember.user = user;
            partyMember.status = '호스트';
            party.partyMember = [partyMember];

            createdParty = await queryRunner.manager.save(Party, party);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(
                '파티신청에 실패하였습니다. 파티정보를 다시 확인하시고 시도하여 주시기 바랍니다.',
            );
        } finally {
            await queryRunner.release();
        }
        return createdParty;
    }

    async updateParty(partyId: number, data) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { addThumbnail, removeThumbnail, addTagName, removeTagName } = data;
            let party = await queryRunner.manager.findOne(Party, {
                where: { id: partyId },
            });

            party.title = data.title;
            party.content = data.content;
            party.maxMember = data.maxMember;
            party.address = data.address;
            party.date = data.date;

            if (addThumbnail?.length) {
                let newThumbnails = [];
                for (let i = 0; i < addThumbnail.length; i++) {
                    let thumbnail = new Thumbnail();
                    thumbnail.thumbnail = addThumbnail[i];
                    thumbnail.party = party;

                    newThumbnails.push(thumbnail);
                }
                party.thumbnail = newThumbnails;
            }

            if (addTagName?.length) {
                let newTags = [];
                for (let i = 0; i < addTagName.length; i++) {
                    let tag = await queryRunner.manager.findOne(Tag, {
                        where: {
                            tagName: addTagName[i],
                        },
                    });
                    if (tag) {
                        tag.freq += 1;
                    }
                    if (!tag) {
                        tag = new Tag();
                        tag.tagName = addTagName[i];
                    }
                    newTags.push(tag);
                }

                party.tag = newTags;
            }

            if (removeThumbnail) {
                for (let i = 0; i < removeThumbnail.length; i++) {
                    party.thumbnail = party.thumbnail.filter(
                        (thumbnail) => thumbnail.id !== removeThumbnail[i],
                    );
                }
            }

            if (removeTagName) {
                for (let i = 0; i < removeTagName.length; i++) {
                    const tag = await queryRunner.manager.findOne(Tag, {
                        where: { id: removeTagName[i] },
                    });
                    tag.freq -= 1;
                    if (tag.freq <= 0) {
                        await queryRunner.manager.softDelete(Tag, tag.id);
                    }
                    queryRunner.manager.save(tag);

                    party.tag = party.tag.filter((tag) => tag.tagName !== removeTagName[i]);
                }
            }

            await queryRunner.manager.save(Party, party);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(
                '파티수정에 실패하였습니다. 파티정보를 다시 확인하시고 시도하여 주시기 바랍니다.',
            );
        } finally {
            await queryRunner.release();
        }
    }

    async applyParty(user: User, partyId: number) {
        const existingPartyMember = await this.partyMemberRepository.findOne({
            where: { partyId, userId: user.id },
        });

        if (existingPartyMember) {
            throw new NotFoundException(`이미 신청하셨습니다.`);
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
            where: { userId, partyId },
        });

        if (!partyMember) {
            throw new NotFoundException(`신청하지 않은 파티입니다.`);
        }

        return await this.partyMemberRepository.softDelete({
            userId,
            partyId,
        });
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
            relations: ['wishList', 'partyMember', 'review', 'tag', 'thumbnail'],
        });

        if (party.hostId !== userId) {
            throw new ForbiddenException(`해당 호스트만 삭제가 가능합니다.`);
        }

        return this.partyRepository.softRemove(party);
    }
}
