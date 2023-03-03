import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity({ schema: "Sparta_Final_Project", name: "reviews" })
  export class Review {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;
  
    @Column("int")
    userId: number;
  
    @Column("int")
    partyId: number;
  
    @Column("int")
    rating: string;
  
    @Column("varchar", { length: 1000 })
    review: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;
  }