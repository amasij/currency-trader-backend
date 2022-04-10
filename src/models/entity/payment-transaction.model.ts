import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {TransactionStatusConstant} from "../enums/transaction-status-constant";
import {PaymentProviderConstant} from "../enums/payment-provider-constant";
import {WalletCurrencyBalance} from "./wallet-currency-balance.model";
import {TransactionTypeConstant} from "../enums/transaction-type-constant";
import {Order} from "./order.model";

@Entity()
export class PaymentTransaction extends BaseModel {
    @Column({type: 'decimal', precision: 10, scale: 2})
    amount!: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    paymentProviderCharge!: number;

    @Column({unique: true})
    paymentReference!: string;

    @Column()
    description!: string;

    @Column()
    paymentProviderPaymentReference!: string;

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

    @Column({
        type: "enum",
        enum: TransactionTypeConstant,
    })
    transactionType!: TransactionTypeConstant

    @OneToMany(type => Order, order => Order)
    order!: Order[];

    @ManyToOne(type => WalletCurrencyBalance,
        walletCurrencyBalance => walletCurrencyBalance.paymentTransactions,
        {nullable: true})
    walletCurrencyBalance!: WalletCurrencyBalance
}