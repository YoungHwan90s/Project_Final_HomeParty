import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity({ schema: "Sparta_Final_Project", name: "parties" })
  export class Party {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;
  
    @Column("int")
    hostId: number;
  
    @Column("varchar", { length: 50 })
    title: string;
  
    @Column("varchar", { length: 1000 })
    content: string;
  
    @Column("int")
    maxMember: number;
  
    @Column("int", {default: 1})
    currMember: number;
  
    @Column("varchar", { length: 10 })
    region: string;

    @Column("varchar", { length: 100 })
    address: string

    @Column()
    date: Date

    @Column("varchar", {default: "모집중"})
    status: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;
  }