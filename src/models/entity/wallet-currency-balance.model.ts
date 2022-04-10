import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {Currency} from "./currency.model";
import {Wallet} from "./wallet.model";
import {Trade} from "./trade.model";
import {PaymentTransaction} from "./payment-transaction.model";

@Entity()
export class WalletCurrencyBalance extends BaseModel {
    @Column({type: 'decimal', precision: 10, scale: 2})
    amount!: number;

    @OneToMany(type => Trade, trade => Trade)
    trade!: Trade[];

    @OneToMany(type => PaymentTransaction, paymentTransaction => paymentTransaction.walletCurrencyBalance)
    paymentTransactions!: PaymentTransaction[];

    @ManyToOne(type => Currency, currency => currency.walletCurrencyBalance)
    currency!: Currency

    @ManyToOne(type => Wallet, wallet => wallet.walletCurrencyBalance)
    wallet!: Wallet

}