import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {TransactionStatusConstant} from "../enums/transaction-status-constant";
import {PaymentProviderConstant} from "../enums/payment-provider-constant";
import {Wallet} from "./wallet.model";

@Entity()
export class PaymentTransaction extends BaseModel {
    @Column()
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

    @ManyToOne(type => Wallet, wallet => wallet.paymentTransactions)
    wallet!: Wallet
}