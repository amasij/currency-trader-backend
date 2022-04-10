import {BaseModel} from "./base.model";
import {Column, Entity, ManyToOne} from "typeorm";
import {Currency} from "./currency.model";
import {User} from "./user.model";
import {OrderStatusConstant} from "../enums/order-status-constant";
import {PaymentTransaction} from "./payment-transaction.model";
import {State} from "./state.model";

@Entity()
export class Order extends BaseModel{
    @Column()
    customerFirstName!: string;

    @Column()
    customerLastName!: string;

    @Column()
    customerPhoneNumber!: string;

    @Column()
    address!: string;

    @Column({unique:true})
    reference!: string;

    @Column({type: 'bigint'})
    amount!: number;

    @Column({
        type: "enum",
        enum: OrderStatusConstant,
    })
    orderStatus!: OrderStatusConstant

    @Column({type: 'bigint'})
    currencyNairaValue!:number;

    @ManyToOne(type => State, state => state.order)
    state!: State;

    @ManyToOne(type => PaymentTransaction, pt => pt.order)
    paymentTransaction!: PaymentTransaction

    @ManyToOne(type => User, user => user.orders)
    user!: User;

    @ManyToOne(type => Currency, currency => currency.order)
    currency!: Currency
}