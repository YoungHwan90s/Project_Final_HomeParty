import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity({ schema: "Sparta_Final_Project", name: "applyLists" })
  export class ApplyList {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;
  
    @Index({ unique: true })
    @Column("varchar", { length: 10 })
    userId: string;
  
    @Column("varchar", { length: 10 })
    name: string;
  
    @Column("varchar", { length: 20, select: false })
    password: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date | null;
  
    @DeleteDateColumn()
    deletedAt: Date | null;
  }