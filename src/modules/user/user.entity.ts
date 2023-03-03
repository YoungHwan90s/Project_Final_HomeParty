import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity({ schema: "Sparta_Final_Project", name: "users" })
  export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Index({ unique: true })
    @Column("int")
    kakaologinId: number | null;
  
    @Column("varchar", { length: 20 })
    email: string;
  
    @Column("varchar", { length: 20, select: false })
    password: string;

    @Column("varchar", { length: 10 })
    name: string;

    @Column("varchar", { length: 2 })
    sex: string;

    @Column("int")
    phone: number;

    @Column("varchar", { length: 50 })
    birthday: string | null;

    @Column("varchar", { length: 5})
    region: string | null;

    @Column("varchar", { length: 100})
    address: string | null;

    @Column("varchar", { length: 100})
    profile: string | null;

    @Column("varchar", { length: 1000})
    introduction: string | null;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date | null;
  
    @DeleteDateColumn()
    deletedAt: Date | null;
  }