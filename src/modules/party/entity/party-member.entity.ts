import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Party } from './party.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'partyMembers' })
export class PartyMember {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int')
    userId: number;

    @Column('int')
    partyId: number;

    @Column('varchar', { default: '신청대기' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 파티멤버 <-> 파티: 다대일 관계
    @ManyToOne(() => Party, (party) => party.partyMember, { onUpdate: 'CASCADE' })
    party: Party;

    // 파티멤버 <-> 유저: 다대일 관계
    @ManyToOne(() => User, (user) => user.partyMember)
    user: User;
}
