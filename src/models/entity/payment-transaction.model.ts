import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {TransactionStatusConstant} from "../enums/transaction-status-constant";
import {PaymentProviderConstant} from "../enums/payment-provider-constant";
import {Wallet} from "./wallet.model";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";

@Entity()
export class PaymentTransaction extends BaseModel {
    @Column({type: 'bigint'})
    amount!: number;

    @Column()
    paymentReference!: number;

    @Column({
        type: "enum",
        enum: PaymentProviderConstant,
    })
    paymentProvider!: PaymentProviderConstant

    @Column({
        type: "enum",
        enum: TransactionStatusConstant,
    })
    transactionStatus!: TransactionStatusConstant

    @ManyToOne(type => WalletCurrencyBalance, walletCurrencyBalance => walletCurrencyBalance.paymentTransactions)
    walletCurrencyBalance!: WalletCurrencyBalance
}