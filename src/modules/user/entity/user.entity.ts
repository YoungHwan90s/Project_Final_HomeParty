import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PartyMember } from '../../party/entity/party-member.entity';
import { Review } from '../../review/entity/review.entity';
import { WishList } from './wish-list.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { nullable: true, length: 30 })
    kakaologinEmail: string | null;

    @Column('varchar', { length: 50 })
    email: string;

    @Column('varchar', { length: 100 })
    password: string;

    @Column('varchar', { length: 10 })
    name: string;

    @Column('varchar', { length: 2 })
    sex: string;

    @Column('varchar', { length: 20 })
    phone: string;

    @Column('varchar', { nullable: true, length: 50 })
    birthday: string | null;

    @Column('varchar', { nullable: true, length: 100 })
    address: string | null;

    @Column('varchar', { nullable: true, length: 100 })
    profile: string | null;

    @Column('varchar', { nullable: true, length: 1000 })
    introduction: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 유저 <-> 장바구니: 일대다 관계
    @OneToMany(() => WishList, (wishList) => wishList.user)
    wishList: WishList[];

    // 유저 <-> 파티멤버: 일대다 관계
    @OneToMany(() => PartyMember, (partyMember) => partyMember.user)
    partyMember: PartyMember[];

    // 유저 <-> 리뷰: 일대다 관계
    @OneToMany(() => Review, (review) => review.user)
    review: Review[];
}
