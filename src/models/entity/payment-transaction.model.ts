import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {TransactionStatusConstant} from "../enums/transaction-status-constant";
import {PaymentProviderEnum} from "../enums/payment-provider.enum";
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
        enum: PaymentProviderEnum,
    })
    paymentProvider!: PaymentProviderEnum

    @Column({
        type: "enum",
        enum: TransactionStatusConstant,
    })
    transactionStatus!: TransactionStatusConstant


    @OneToMany(type => Order, order => Order)
    order!: Order[];

}