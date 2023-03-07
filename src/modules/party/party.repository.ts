import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Party } from './entity/party.entity';
import { PartyMember } from './entity/party-member.entity';
import { Thumbnail } from './entity/thumbnail.entity';

@Injectable()
export class PartyRepository extends Repository<Party> {
    constructor(private dataSource: DataSource) {
        super(Party, dataSource.createEntityManager());
    }

    async getParty() {
        const result = await this.createQueryBuilder()
            .select('party')
            .from(Party, 'party')
            .getRawMany();
        return result;
    }
}
