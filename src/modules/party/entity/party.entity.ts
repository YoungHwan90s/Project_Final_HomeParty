import { Max, Min } from 'class-validator';
import { User } from 'src/modules/user/entity/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Review } from '../../review/entity/review.entity';
import { WishList } from '../../user/entity/wish-list.entity';
import { PartyMember } from './party-member.entity';
import { Tag } from './tag.entity';
import { Thumbnail } from './thumbnail.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'parties' })
export class Party {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int')
    hostId: number;

    @Column('varchar', { length: 50 })
    title: string;

    @Column('varchar', { length: 1000 })
    content: string;

    @Column('int', { default: 2 })
    maxMember: number;

    @Column('int', { default: 1 })
    currMember: number;

    @Column('varchar', { length: 100 })
    address: string;

    @Column('date')
    date: Date;

    @Column('varchar', { default: '모집중' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 파티 <-> 유저: 다대일 관계
    @ManyToOne(() => User, (user) => user.party)
    @JoinColumn({ name: 'hostId' })
    user: User;

    // 파티 <-> 장바구니: 일대다 관계
    @OneToMany(() => WishList, (wishList) => wishList.party, { cascade: true })
    wishList: WishList[];

    // 파티 <-> 피티멤버: 일대다 관계
    @OneToMany(() => PartyMember, (partyMember) => partyMember.party, { cascade: true })
    partyMember: PartyMember[];

    // 파티 <-> 리뷰: 일대다 관계
    @OneToMany(() => Review, (review) => review.party, { cascade: true })
    review: Review[];

    // 파티 <-> 태그: 다대다 관계
    @ManyToMany(() => Tag, { onDelete: "RESTRICT" })
    @JoinTable({
        name: 'PartyTagMapping',
        joinColumn: {
            name: 'partyId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tagId',
            referencedColumnName: 'id',
        },
    })
    tag: Tag[];

    // 파티 <-> 썸네일: 일대다 관계
    @OneToMany(() => Thumbnail, (thumbnail) => thumbnail.party, { cascade: true })
    thumbnail: Thumbnail[];
}
