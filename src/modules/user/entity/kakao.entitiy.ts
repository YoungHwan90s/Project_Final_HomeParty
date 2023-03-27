import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'kakaos' })
export class Kakao {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('int')
    userId: number;

    @Column('int')
    kakaoPrimaryId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 유저 <-> 카카오 일대일 관계
    @OneToOne(() => User, (user) => user.kakao)
    @JoinColumn({ name: 'userId' })
    user: User;
}
