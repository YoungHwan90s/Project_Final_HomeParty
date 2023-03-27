import { Party } from 'src/modules/party/entity/party.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PartyMember } from '../../party/entity/party-member.entity';
import { Review } from '../../review/entity/review.entity';
import { Kakao } from './kakao.entitiy';
import { WishList } from './wish-list.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { length: 50 })
    email: string;

    @Column('varchar', { nullable: true, length: 100 })
    password: string | null;

    @Column('varchar', { nullable: true, length: 10 })
    name: string;

    @Column('varchar', { length: 2 })
    sex: string | null;

    @Column('varchar', { length: 20 })
    phone: string | null;

    @Column('varchar', { nullable: true, length: 50 })
    birthday: string | null;

    @Column('varchar', { nullable: true, length: 100 })
    address: string | null;

    @Column('text', { nullable: true} )
    profile: string | null;

    @Column('varchar', { nullable: true, length: 1000 })
    introduction: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 유저 <-> 파티: 일대다 관계
    @OneToMany(() => Party, (party) => party.user, { cascade: true })
    party: Party[];

    // 유저 <-> 장바구니: 일대다 관계
    @OneToMany(() => WishList, (wishList) => wishList.user, { cascade: true })
    wishList: WishList[];

    // 유저 <-> 파티멤버: 일대다 관계
    @OneToMany(() => PartyMember, (partyMember) => partyMember.user, { cascade: true })
    partyMember: PartyMember[];

    // 유저 <-> 리뷰: 일대다 관계
    @OneToMany(() => Review, (review) => review.user, { cascade: true })
    review: Review[];

    // 유저 <-> 카카오 일대일 관계
    @OneToOne(() => Kakao, (kakao) => kakao.user,  { cascade: true })
    kakao: Kakao;
}
