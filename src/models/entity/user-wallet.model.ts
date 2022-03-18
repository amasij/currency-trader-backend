import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {User} from "./user.model";
import {Wallet} from "./wallet.model";

@Entity()
export class UserWallet extends BaseModel {
    @ManyToOne(type => User, user => user.userWallets)
    user!: User;

    @ManyToOne(type => Wallet, wallet => wallet.userWallets)
    wallet!: Wallet

}