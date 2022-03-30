import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {Currency} from "./currency.model";
import {OrderTypeConstant} from "../enums/order-type-constant";
import {Wallet} from "./wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";

@Entity()
export class Trade extends BaseModel {
    @Column({type: 'bigint'})
    currentWalletCurrencyBalanceAmount!: number;

    @Column({type: 'bigint'})
    currentFromCurrencyNairaValue!: number;

    @Column({type: 'bigint'})
    currentToCurrencyNairaValue!: number;

    @Column({
        type: "enum",
        enum: OrderTypeConstant,
    })
    orderType!: OrderTypeConstant;

    @Column({type: 'bigint'})
    amount!: number;

    @ManyToOne(type => Currency, currency => currency.fromTrade)
    fromCurrency!: Currency

    @ManyToOne(type => Currency, currency => currency.toTrade)
    toCurrency!: Currency

    @ManyToOne(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.trade)
    walletCurrencyBalance!: WalletCurrencyBalance

}