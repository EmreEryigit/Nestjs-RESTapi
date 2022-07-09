import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    email: string;
    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log(this.id)
    }
    @AfterUpdate()
    logUpdate() {
        console.log(this.id)
    }
    @AfterRemove()
    logRemove() {
        console.log(this.id)
    }
}