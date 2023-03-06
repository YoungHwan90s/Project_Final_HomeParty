import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
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

    async getParties() {
        return await this.partyRepository.find({
            where: { deletedAt: null },
        });
    }

    async getPartyById(partyId: number) {
        return await this.partyRepository.findOne({
            where: { id: partyId, deletedAt: null },
        });
    }

    async createParty(party: CreatePartyDto) {
        return await this.partyRepository.insert(party);
    }

    async updateParty(
        userId: number,
        partyId: number,
        party: UpdatePartyDto,
    ): Promise<void | InternalServerErrorException> {
        try {
            const result = await this.partyRepository.update(partyId, party);
            if (result.affected === 0) {
                throw new NotFoundException(`파티 아이디 중 ${partyId} 를 찾을 수 없습니다.`);
            }
        } catch (error) {
            throw new InternalServerErrorException(
                `파티 업데이트에 실패했습니다 : ${error.message}`,
            );
        }
    }

    async applyParty(partyId: number, userId: number) {
        try {
            const party = await this.partyRepository.findOne({
                where: { id: partyId, deletedAt: null },
            });
            if (!party) {
                throw new NotFoundException('파티를 찾을 수 없습니다');
            }

            const result = await this.PartyMembersRepository.insert({
                partyId,
                userId,
            });
        } catch (error) {
            throw new InternalServerErrorException(`파티 신청에 실패했습니다 : ${error.message}`);
        }
    }

    async getPartyMembers(partyId: number) {
        try {
            return await this.PartyMembersRepository.find({
                where: { partyId },
            });
        } catch (error) {
            throw new InternalServerErrorException(
                `파티맴버 조회를 실패했습니다 : ${error.message}`,
            );
        }
    }
}
