import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {Currency} from "./currency.model";
import {OrderTypeConstant} from "../enums/order-type-constant";
import {Wallet} from "./wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";

@Entity()
export class Trade extends BaseModel {
    @Column({type: 'decimal', precision: 10, scale: 2})
    currentWalletCurrencyBalanceAmount!: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    currentFromCurrencyNairaValue!: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    currentToCurrencyNairaValue!: number;

    @Column({
        type: "enum",
        enum: OrderTypeConstant,
    })
    orderType!: OrderTypeConstant;

    @Column({type: 'decimal', precision: 10, scale: 2})
    amount!: number;

    @ManyToOne(type => Currency, currency => currency.fromTrade)
    fromCurrency!: Currency

    @ManyToOne(type => Currency, currency => currency.toTrade)
    toCurrency!: Currency

    @ManyToOne(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.trade)
    walletCurrencyBalance!: WalletCurrencyBalance

}