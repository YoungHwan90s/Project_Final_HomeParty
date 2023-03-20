import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'Sparta_Final_Project', name: 'kakao' })
export class Kakao {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { nullable: true, length: 30 })
    userId: string | null;

    @Column('varchar', { nullable: true, length: 30 })
    kakaoId: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    // 유저 <-> 카카오 일대일 관계
    @OneToOne(() => User, (user) => user.kakao)
    user: User;
}
