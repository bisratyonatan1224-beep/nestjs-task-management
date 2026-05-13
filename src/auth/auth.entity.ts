import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bycrypt from 'bcrypt';
import { Task } from "src/tasks/tasks.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    username: string;

    @Column()
    password: string;
    
    @Column()
    salt: string;

    @OneToMany(type=>Task, task => task.user, {eager: true})
    tasks : Task[]

    async validatePassword(password : string) : Promise<boolean>{
        const hash = await bycrypt.hash(password, this.salt);
        return hash === this.password;
    }
}