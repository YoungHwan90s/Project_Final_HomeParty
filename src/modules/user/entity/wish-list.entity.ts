import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Party } from '../../party/entity/party.entity';
import { User } from './user.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'wishLists' })
export class WishList {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int')
    userId: number;

    @Column('int')
    partyId: number;

    @CreateDateColumn()
    createdAt: Date;

    // 장바구니 <-> 유저: 다대일 관계
    @ManyToOne(() => User, (user) => user.wishList)
    user: User;

    // 장바구니 <-> 파티: 일대일 관계
    @OneToOne(() => Party, party => party.wishList)
    party: Party;
}
