import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {UserWallet} from "./user-wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";
import {Trade} from "./trade.model";

@Entity()
export class Currency extends BaseModel {
    @Column()
    amount!: number;

    @Column({})
    nairaValue!: string;

    @OneToMany(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.currency)
    walletCurrencyBalance!: WalletCurrencyBalance[];

    @OneToMany(type => Trade, trade => Trade)
    fromTrade!: Trade[];

    @OneToMany(type => Trade, trade => Trade)
    toTrade!: Trade[];
}