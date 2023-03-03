import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity({ schema: "Sparta_Final_Project", name: "parties" })
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
  }