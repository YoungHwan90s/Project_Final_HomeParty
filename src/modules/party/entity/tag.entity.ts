import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Party } from './party.entity';

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

    @DeleteDateColumn()
    deletedAt: Date | null;

    @UpdateDateColumn()
    updatedAt: Date;

    // // 파티 <-> 태그: 다대다 관계
    @ManyToMany(() => Party)
    party: Party[];
}
