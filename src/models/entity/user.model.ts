import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseModel} from "./base.model";
import {UserWallet} from "./user-wallet.model";
import {Order} from "./order.model";

@Entity()
export class User extends BaseModel {

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    password!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column({
        default: false
    })
    emailVerified!: boolean;

    @Column({
        unique: true
    })
    phoneNumber!: string;


    @OneToMany(type => UserWallet, userWallet => userWallet.user)
    userWallets!: UserWallet[];


    @OneToMany(type => Order, order => order.user)
    orders!: Order[];


}