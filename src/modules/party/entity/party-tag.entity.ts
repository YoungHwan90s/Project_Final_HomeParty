import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PartyTagMapping } from './party-tag-mapping.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'tags' })
export class Tag {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { length: 50, nullable: true })
    tagName: string;

    @Column('int', { default: 1 })
    freq: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 파티 <-> 파티-태그-맵핑: 일대다 관계
    @OneToMany(() => PartyTagMapping, (partyTagMapping) => partyTagMapping.tag, {cascade: true})
    partyTagMapping: PartyTagMapping[];
}
