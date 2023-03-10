import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../../tag/entity/tag.entity';
import { Party } from './party.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'partyTagMappings' })
export class PartyTagMapping {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int')
    partyId: number;

    @Column('int')
    tagId: number;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 파티-태그-맵핑 <-> 파티: 다대일 관계
    @ManyToOne(() => Party, (party) => party.partyTagMapping)
    party: Party;

    // 파티-태그-맵핑 <-> 태그 : 다대일 관계
    @ManyToOne(() => Tag, (tag) => tag.partyTagMapping)
    tag: Tag;
}
