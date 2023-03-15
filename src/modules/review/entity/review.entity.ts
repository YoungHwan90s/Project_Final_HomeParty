import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Party } from "../../party/entity/party.entity";
import { User } from "../../user/entity/user.entity";
  
  @Entity({ schema: "Sparta_Final_Project", name: "reviews" })
  export class Review {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;
  
    @Column("int")
    userId: number;
  
    @Column("int")
    partyId: number;
  
    @Column("varchar")
    rating: string;
  
    @Column("varchar", { length: 1000 })
    review: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    // 리뷰 <-> 파티ㅣ 다대일 관계
    @ManyToOne(() => Party, (party) => party.review)
    party: Party;

    // 리뷰 <-> 유저 다대일 관계
    @ManyToOne(() => User, (user) => user.review)
    user: User;
    
  }