import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { PartyMember } from './entity/party-member.entity';
import { PartyRepository } from './party.repository';

@Injectable()
export class PartyService {
    constructor(
        private partyRepository: PartyRepository,
        @InjectRepository(PartyMember) private PartyMembersRepository: Repository<PartyMember>,
    ) {}

    async getParties() {
        return await this.partyRepository.getParty();
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
        const result = await this.partyRepository.update(partyId, party);
    }

    async applyParty(partyId: number, userId: number) {
        const party = await this.partyRepository.findOne({
            where: { id: partyId, deletedAt: null },
        });

        const result = await this.PartyMembersRepository.insert({
            partyId,
            userId,
        });
    }

    async getPartyMembers(partyId: number) {
        return await this.PartyMembersRepository.find({
            where: { partyId },
        });
    }
}
