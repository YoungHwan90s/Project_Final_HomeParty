import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Party } from "./party.entity";
  
  @Entity({ schema: "Sparta_Final_Project", name: "thumbnails" })
  export class Thumbnail {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;
  
    @Column("varchar", { length: 100 })
    thumbnamil: string;
  
    @Column("int")
    partyId: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    // 썸네일 <-> 파티: 다대일 관계
    @ManyToOne(() => Party, (party) => party.thumbnail)
    party: Party;
  }