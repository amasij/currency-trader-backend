import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseModel} from "./base.model";
import {UserWallet} from "./user-wallet.model";

@Entity()
export class User extends BaseModel {

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column({
        unique: true
    })
    phoneNumber!: number;


    @OneToMany(type => UserWallet, userWallet => userWallet.user)
    userWallets!: UserWallet[];


}