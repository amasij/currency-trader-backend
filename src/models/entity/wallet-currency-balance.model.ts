import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {Currency} from "./currency.model";
import {Wallet} from "./wallet.model";

@Entity()
export class WalletCurrencyBalance extends BaseModel {
    @Column()
    amount!: number;

    @ManyToOne(type => Currency, currency => currency.walletCurrencyBalance)
    currency!: Currency

    @ManyToOne(type => Wallet, wallet => wallet.walletCurrencyBalance)
    wallet!: Wallet

}