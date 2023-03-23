import {
    ForbiddenException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { User } from '../user/entity/user.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartyMember } from './entity/party-member.entity';
import { Party } from './entity/party.entity';
import { Thumbnail } from './entity/thumbnail.entity';
import { UpdatePartyDto } from './dto/update-party.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PartyService {
    constructor(
        @InjectRepository(Party) private partyRepository: Repository<Party>,
        @InjectRepository(PartyMember) private partyMemberRepository: Repository<PartyMember>,
        private readonly dataSource: DataSource,
    ) {}

    async searchParties(date: Date, address: string, title: string): Promise<Party[]> {
        let query = this.partyRepository.createQueryBuilder("party")

        query = query.leftJoinAndSelect('party.thumbnail', 'thumbnail')
                    .leftJoinAndSelect('party.wishList', 'wishList')
                    .where('party.deletedAt IS NULL')
                    .andWhere('party.status = :status', { status: '모집중' });

        if (!isNaN(date.getTime())) {
            let month = date.getMonth() + 1 < 10 ? `0${(date.getMonth()+1).toString()}` : (date.getMonth()+1).toString()
            let day = date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate().toString()
            const year = date.getFullYear().toString()
            
            const dateStr = `${year}-${month}-${day}`
          query = query.andWhere(`party.date= :date`, { date: dateStr });
        }
        if (address) {
          query = query.andWhere(`party.address LIKE :address`, { address: `%${address}%` });
        }
        if (title) {
          query = query.andWhere(`party.title LIKE :title`, { title: `%${title}%` });
        }

        const result = await query.getMany();
        return result
      }

    async getParties(page: number): Promise<Party[]> {
            return await this.partyRepository.find({
            where: { deletedAt: null, status: '모집중' },
            relations: ['thumbnail', 'wishList'],
            take: 12,
            skip: (page - 1) * 12,
        })
    }

    async getPartyById(partyId: number): Promise<Party> {
        return await this.partyRepository.findOne({ where: { id: partyId } });
    }

    async getPartyByIdWithRelations(partyId: number): Promise<Party> {
        return await this.partyRepository.findOne({
            relations: ['thumbnail', 'partyMember', 'tag', 'wishList', 'partyMember.user', 'user'],
            where: { id: partyId, deletedAt: null },
        });
    }

    async createParty(user: User, partyInfo: CreatePartyDto): Promise<Party> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let createdParty: Party;

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

    async updateParty(partyId: number, data: UpdatePartyDto): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { addThumbnail, removeThumbnail, addTagName, removeTagName } = data;
            let party = await queryRunner.manager.findOne(Party, {
                where: { id: partyId },
                relations: ['thumbnail', 'tag'],
            });

            party.title = data.title;
            party.content = data.content;
            party.maxMember = data.maxMember;
            party.address = data.address;
            party.date = data.date;

            if (addThumbnail?.length) {
                let thumbnailArray = [];
                for (let i = 0; i < addThumbnail.length; i++) {
                    let thumbnail = new Thumbnail();
                    thumbnail.thumbnail = addThumbnail[i];

                    thumbnailArray.push(thumbnail);
                }
                party.thumbnail = [...party.thumbnail, ...thumbnailArray];
            }

            if (addTagName?.length) {
                let tagArray = [];
                for (let i = 0; i < addTagName.length; i++) {
                    let tag = await queryRunner.manager.findOne(Tag, {
                        where: {
                            tagName: addTagName[i],
                        },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (tag) {
                        tag.freq += 1;
                        tagArray.push(tag);

                        await queryRunner.manager.update(Tag, tag.id, tag);
                    } else {
                        tag = new Tag();
                        tag.tagName = addTagName[i];

                        tagArray.push(tag);
                    }
                }
                party.tag = [...party.tag, ...tagArray];
            }

            if (removeThumbnail?.length) {
                for (let i = 0; i < removeThumbnail.length; i++) {
                    let removeThumbnailId = removeThumbnail[i]['id'];

                    party.thumbnail = party.thumbnail.filter(
                        (thumbnail) => thumbnail.id !== Number(removeThumbnailId),
                    );
                }
            }

            if (removeTagName?.length) {
                for (let i = 0; i < removeTagName.length; i++) {
                    const tag = await queryRunner.manager.findOne(Tag, {
                        where: { tagName: removeTagName[i] },
                    });
                    tag.freq -= 1;
                    if (tag.freq <= 0) {
                        await queryRunner.manager.softDelete(Tag, tag.id);
                    }
                    await queryRunner.manager.save(tag);

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

    async applyParty(user: User, partyId: number): Promise<PartyMember> {
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

    async getPartyMembers(partyId: number): Promise<PartyMember[]> {
        return await this.partyMemberRepository.find({
            where: { partyId },
        });
    }

    async cancelParty(userId: number, partyId: number): Promise<DeleteResult> {
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

    async acceptMember(partyId: number, userId: number, status: string): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let partyMember = await queryRunner.manager.findOne(PartyMember, {
                where: { userId, partyId },
                relations: ['party'],
            });

            if (!partyMember) {
                throw new NotFoundException('신청 유저가 존재하지 않습니다.');
            }

            if (partyMember.party.status === '모집중') {
                if (partyMember.status === '신청대기' && status === '승낙') {
                    partyMember.status = status;
                    partyMember.party.currMember += 1;

                    await queryRunner.manager.update(Party, partyId, {
                        currMember: partyMember.party.currMember,
                    });

                    await queryRunner.manager.save(PartyMember, partyMember);
                    await queryRunner.commitTransaction();

                    return 1;
                }

                if (partyMember.status === '신청대기' && status === '거절') {
                    partyMember.status = status;
                    await queryRunner.manager.save(PartyMember, partyMember);
                    await queryRunner.commitTransaction();

                    return 3;
                }

                if (partyMember.status === '승낙' && status === '승낙') {
                    partyMember.status = '신청대기';
                    partyMember.party.currMember -= 1;
                    await queryRunner.manager.update(Party, partyId, {
                        currMember: partyMember.party.currMember,
                    });

                    await queryRunner.manager.save(PartyMember, partyMember);
                    await queryRunner.commitTransaction();

                    return 0;
                }

                if (partyMember.status === '승낙' && status === '거절') {
                    partyMember.status = status;
                    partyMember.party.currMember -= 1;

                    await queryRunner.manager.update(Party, partyId, {
                        currMember: partyMember.party.currMember,
                    });

                    await queryRunner.manager.save(PartyMember, partyMember);
                    await queryRunner.commitTransaction();

                    return 2;
                }

                if (partyMember.status === '거절' && status === '거절') {
                    partyMember.status = '신청대기';

                    await queryRunner.manager.save(PartyMember, partyMember);
                    await queryRunner.commitTransaction();

                    return 0;
                }

                if (partyMember.status === '거절' && status === '승낙') {
                    partyMember.status = status;
                    partyMember.party.currMember += 1;

                    await queryRunner.manager.update(Party, partyId, {
                        currMember: partyMember.party.currMember,
                    });
                    await queryRunner.manager.save(PartyMember, partyMember);
                    await queryRunner.commitTransaction();

                    return 1;
                }
            } else {
                throw new UnauthorizedException('현재 모집중인 파티가 아닙니다.');
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async deleteParty(userId: number, partyId: number): Promise<Party> {
        const party = await this.partyRepository.findOne({
            where: { id: partyId },
            relations: ['wishList', 'partyMember', 'review', 'thumbnail'],
        });

        if (party.hostId !== userId) {
            throw new ForbiddenException(`해당 호스트만 삭제가 가능합니다.`);
        }

        return this.partyRepository.softRemove(party);
    }

    @Cron('0 0 0 * * *')
    async updateCompletionStatus() {
        const currentDate = new Date();
    
        const party = await this.partyRepository.find({
            where: { status: '모집중', deletedAt: null },
        });
    
        for (let i = 0; i < party.length; i++) {
            if (party[i].date <= currentDate) {
                party[i].status = "마감";
                await this.partyRepository.save(party[i]);
            }
        }
    }

    async getUserHost(id): Promise<PartyMember[]> {
        return await this.partyMemberRepository.find({ 
            where: { deletedAt: null, userId: id, status: "호스트" },
            relations: ['party','party.thumbnail','party.partyMember'],
        });
    }
}
