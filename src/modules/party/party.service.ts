import {
    ForbiddenException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, LessThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { User } from '../user/entity/user.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartyMember } from './entity/party-member.entity';
import { Party } from './entity/party.entity';
import { Thumbnail } from './entity/thumbnail.entity';
import { UpdatePartyDto } from './dto/update-party.dto';
import { Cron } from '@nestjs/schedule';
import { CacheService } from 'src/util/cache/cache.service';

@Injectable()
export class PartyService {
    constructor(
        @InjectRepository(Party) private partyRepository: Repository<Party>,
        @InjectRepository(PartyMember) private partyMemberRepository: Repository<PartyMember>,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        private readonly dataSource: DataSource,
        private readonly cacheService: CacheService,
    ) {}

    async searchParties(date: Date, address: string, title: string): Promise<Party[]> {
        let query = this.partyRepository.createQueryBuilder('party');

        query = query
            .leftJoinAndSelect('party.thumbnail', 'thumbnail')
            .leftJoinAndSelect('party.wishList', 'wishList')
            .where('party.deletedAt IS NULL')
            .andWhere('party.status = :status', { status: '모집중' })
            .orderBy('party.createdAt', 'DESC');

        if (!isNaN(date.getTime())) {
            let month =
                date.getMonth() + 1 < 10
                    ? `0${(date.getMonth() + 1).toString()}`
                    : (date.getMonth() + 1).toString();
            let day =
                date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate().toString();
            const year = date.getFullYear().toString();

            const dateStr = `${year}-${month}-${day}`;
            query = query.andWhere(`party.date= :date`, { date: dateStr });
        }
        if (address) {
            query = query.andWhere(`party.address LIKE :address`, { address: `%${address}%` });
        }
        if (title) {
            query = query.andWhere(`party.title LIKE :title`, { title: `%${title}%` });
        }

        return query.getMany();
    }

    async getParties(page: number): Promise<Party[]> {
        let parties: Party[];

        if (page === 1) {
            const cachedParties = await this.cacheService.get('parties');
            if (cachedParties) {
                parties = JSON.parse(cachedParties);
            } else {
                parties = await this.partyRepository.find({
                    where: { deletedAt: null, status: '모집중' },
                    relations: ['thumbnail', 'wishList'],
                    order: { createdAt: 'DESC' },
                    take: 12,
                    skip: (page - 1) * 12,
                });
                const stringifyParties = JSON.stringify(parties);
                // 파티 캐시 처리 (페이지=1)
                await this.cacheService.set('parties', stringifyParties);
            }
        } else {
            parties = await this.partyRepository.find({
                where: { deletedAt: null, status: '모집중' },
                relations: ['thumbnail', 'wishList'],
                order: { createdAt: 'DESC' },
                take: 12,
                skip: (page - 1) * 12,
            });
        }
        return parties;
    }

    async getPartyById(partyId: number): Promise<Party> {
        return await this.partyRepository.findOne({ where: { id: partyId, deletedAt: null } });
    }

    async getPartyByIdWithRelations(partyId: number): Promise<Party> {
        return await this.partyRepository.findOne({
            relations: ['thumbnail', 'partyMember', 'tag', 'wishList', 'partyMember.user', 'user'],
            where: { id: partyId, deletedAt: null },
        });
    }

    async getTopTags(): Promise<Tag[]> {
        return await this.tagRepository.find({
            where: { deletedAt: null },
            order: { freq: 'DESC' },
            take: 5,
        });
    }

    async createParty(user: User, partyInfo: CreatePartyDto): Promise<Party> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let createdParty: Party;

        try {
            const party = new Party();
            party.user = user;
            party.title = partyInfo.title;
            party.content = partyInfo.content;
            party.maxMember = partyInfo.maxMember;
            party.address = partyInfo.address;
            party.date = partyInfo.date;

            if (partyInfo.tagName?.length) {
                let set = new Set(partyInfo.tagName);
                let saveTag = [...set];

                let newTags = [];

                for (let i = 0; i < saveTag.length; i++) {
                    let tag = await queryRunner.manager.findOne(Tag, {
                        where: {
                            tagName: saveTag[i],
                        },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (tag) {
                        tag.freq += 1;
                        await queryRunner.manager.update(Tag, tag.id, { freq: tag.freq });
                    }
                    if (!tag) {
                        tag = new Tag();
                        tag.tagName = partyInfo.tagName[i];
                        await queryRunner.manager.save(Tag, tag);
                    }

                    newTags.push(tag);
                }

                party.tag = newTags;
            }

            if (partyInfo.thumbnail?.length) {
                let newThumbnails = [];
                for (let i = 0; i < partyInfo.thumbnail.length; i++) {
                    let thumbnail = new Thumbnail();
                    thumbnail.thumbnail = partyInfo.thumbnail[i];
                    newThumbnails.push(thumbnail);
                }
                party.thumbnail = newThumbnails;
            }

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
            // 새로 추가 시 - 파티 캐시 삭제
            await this.cacheService.del('parties');
            await queryRunner.release();
        }
        return createdParty;
    }

    async updateParty(partyId: number, data: UpdatePartyDto): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let updatedParty: Party;

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

            updatedParty = await queryRunner.manager.save(Party, party);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(
                '파티수정에 실패하였습니다. 파티정보를 다시 확인하시고 시도하여 주시기 바랍니다.',
            );
        } finally {
            const cachedParty = await this.cacheService.get('parties');
            if (cachedParty) {
                const parseCachedParty = JSON.parse(cachedParty);
                const isItCachedParty = parseCachedParty.find(
                    (party) => party.id === updatedParty.id,
                );

                // 업데이트 시 - 파티가 캐싱 되어있다면 캐시 삭제
                if (isItCachedParty) {
                    await this.cacheService.del('parties');
                }
            }
            await queryRunner.release();
        }
        return updatedParty;
    }

    async applyParty(user: User, partyId: number): Promise<PartyMember> {
        const existingPartyMember = await this.partyMemberRepository.findOne({
            where: { partyId, userId: user.id, deletedAt: null },
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
            where: { partyId, deletedAt: null },
        });
    }

    async cancelParty(userId: number, partyId: number): Promise<DeleteResult> {
        const partyMember = await this.partyMemberRepository.findOne({
            where: { userId, partyId, deletedAt: null },
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
                where: { userId, partyId, deletedAt: null },
                relations: ['party'],
            });

            if (!partyMember) {
                throw new NotFoundException('신청 유저가 존재하지 않습니다.');
            }

            if (partyMember.party.status === '모집중') {
                if (partyMember.status === '신청대기' && status === '승낙') {
                    partyMember.status = status;
                    partyMember.party.currMember += 1;

                    if (partyMember.party.currMember === partyMember.party.maxMember) {
                        await queryRunner.manager.update(Party, partyId, {
                            status: '마감',
                        });
                    }

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

                    if (partyMember.party.currMember === partyMember.party.maxMember) {
                        await queryRunner.manager.update(Party, partyId, {
                            status: '마감',
                        });
                    }

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
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let removedParty: Party;
        try {
            let party = await queryRunner.manager.findOne(Party, {
                where: { id: partyId },
                relations: ['wishList', 'partyMember', 'review', 'thumbnail', 'tag'],
                lock: { mode: 'pessimistic_write' },
            });

            if (party.hostId !== userId) {
                throw new ForbiddenException(`파티 호스트만 삭제가 가능합니다.`);
            }

            if (party.tag?.length) {
                for (let i = 0; i < party.tag.length; i++) {
                    party.tag[i].freq -= 1;
                    if (party.tag[i].freq <= 0) {
                        await queryRunner.manager.softRemove(Tag, party.tag[i]);
                    } else {
                        await queryRunner.manager.update(
                            Tag,
                            { id: party.tag[i].id },
                            { freq: party.tag[i].freq },
                        );
                    }
                }
            }
            removedParty = await queryRunner.manager.softRemove(Party, party);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new NotAcceptableException(
                '파티삭제에 실패하였습니다. 잠시 후 다시 시도하여 주시기 바랍니다.',
            );
        } finally {
            const cachedParty = await this.cacheService.get('parties');
            if (cachedParty) {
                const parseCachedParty = JSON.parse(cachedParty);

                const isItCachedParty = parseCachedParty.find(
                    (party) => party.id === removedParty.id,
                );

                // 삭제 시 - 파티가 캐싱 되어있다면 캐시 삭제
                if (isItCachedParty) {
                    await this.cacheService.del('parties');
                }
            }
            await queryRunner.release();
        }
        return removedParty;
    }

    @Cron('*/3 * * * * *')
    // 매일 UTC 15:00 실행 => 한국시간 24:00
    async updateCompletionStatus(): Promise<UpdateResult> {
        let currentDate = new Date();
        currentDate.setUTCHours(currentDate.getUTCHours() + 9);
        currentDate.setDate(currentDate.getDate() - 1);

        let dateString = currentDate.toISOString().substring(0, 10);
        let newDate = new Date(dateString);

        return await this.partyRepository.update(
            { status: '모집중', date: LessThanOrEqual(newDate) },
            { status: '마감' },
        );
    }

    async getUserHost(id: number): Promise<PartyMember[]> {
        return await this.partyMemberRepository.find({
            where: { deletedAt: null, userId: id, status: '호스트' },
            relations: ['party', 'party.thumbnail', 'party.partyMember'],
        });
    }

    async statusParty(partyId: number): Promise<Party> {
        try {
            const party = await this.partyRepository.findOne({ where: { id: partyId } });
            if (party.status !== '마감') {
                party.status = '마감';
            } else {
                party.status = '모집중';
            }
            return await this.partyRepository.save(party);
        } catch (error) {
            throw new NotAcceptableException(
                '파티 상태변경에 실패하였습니다. 잠시 후 다시 시도하여 주시기 바랍니다.',
            );
        }
    }

    async searchUserHostParties(
        id: number,
        date: Date,
        address: string,
        title: string,
    ): Promise<PartyMember[]> {
        let query = this.partyMemberRepository.createQueryBuilder('partyMember');

        query = query
            .leftJoinAndSelect('partyMember.party', 'party')
            .leftJoinAndSelect('party.thumbnail', 'thumbnail')
            .where('party.deletedAt IS NULL')
            .andWhere('partyMember.user.id = :id', { id })
            .andWhere('partyMember.status = :status', { status: '호스트' })
            .orderBy('party.createdAt', 'DESC');

        if (!isNaN(date.getTime())) {
            let month =
                date.getMonth() + 1 < 10
                    ? `0${(date.getMonth() + 1).toString()}`
                    : (date.getMonth() + 1).toString();
            let day =
                date.getDate() < 10 ? `0${date.getDate().toString()}` : date.getDate().toString();
            const year = date.getFullYear().toString();

            const dateStr = `${year}-${month}-${day}`;
            query = query.andWhere(`party.date= :date`, { date: dateStr });
        }
        if (address) {
            query = query.andWhere(`party.address LIKE :address`, { address: `%${address}%` });
        }
        if (title) {
            query = query.andWhere(`party.title LIKE :title`, { title: `%${title}%` });
        }

        return query.getMany();
    }
}
