import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {Currency} from "./currency.model";
import {OrderTypeConstant} from "../enums/order-type-constant";
import {Wallet} from "./wallet.model";

@Entity()
export class Trade extends BaseModel {
    @Column()
    currentWalletBalance!: number;

    @Column()
    currentFromCurrencyNairaValue!: number;

    @Column()
    currentToCurrencyNairaValue!: number;

    @Column({
        type: "enum",
        enum: OrderTypeConstant,
    })
    orderType!: OrderTypeConstant;

    @Column()
    amount!: number;

    @ManyToOne(type => Currency, currency => currency.fromTrade)
    fromCurrency!: Currency

    @ManyToOne(type => Currency, currency => currency.toTrade)
    toCurrency!: Currency

    @ManyToOne(type => Wallet, wallet => wallet.trade)
    wallet!: Wallet

}