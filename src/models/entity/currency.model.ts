import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {UserWallet} from "./user-wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";
import {Trade} from "./trade.model";
import {Order} from "./order.model";

@Entity()
export class Currency extends BaseModel {

    @Column()
    name!: string;

    @Column()
    symbol!: string;

    @Column()
    supported!: boolean;

    @Column({type: 'decimal', precision: 10, scale: 2})
    nairaValue!: number;

    @OneToMany(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.currency)
    walletCurrencyBalance!: WalletCurrencyBalance[];

    @OneToMany(type => Trade, trade => Trade)
    fromTrade!: Trade[];

    @OneToMany(type => Trade, trade => Trade)
    toTrade!: Trade[];

    @OneToMany(type => Order, order => Order)
    order!: Order[];
}