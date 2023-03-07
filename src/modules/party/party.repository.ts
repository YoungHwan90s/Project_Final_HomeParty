import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Party } from './entity/party.entity';

@Injectable()
export class PartyRepository extends Repository<Party> {
    constructor(private dataSource: DataSource) {
        super(Party, dataSource.createEntityManager());
    }

    async getParty() {
        const result = await this.createQueryBuilder('party')
            .leftJoinAndSelect('party.partyMember', 'partyMember')
            .getMany();
        return result;
    }
}
