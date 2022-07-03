import {BaseModel} from "./base.model";
import {Column, Entity, ManyToOne} from "typeorm";
import {Currency} from "./currency.model";
import {User} from "./user.model";
import {OrderStatusEnum} from "../enums/order-status.enum";
import {PaymentTransaction} from "./payment-transaction.model";
import {State} from "./state.model";
import {Address} from "./address.model";
import {OrderTypeEnum} from "../enums/order-type.enum";
import {AccountDetail} from "./account-detail.model";
import {OrderModeConstant} from "../enums/order-mode.enum";

@Entity()
export class Order extends BaseModel{


    @Column({type: 'decimal', precision: 10, scale: 2})
    amount!: number;

    @Column({unique:true})
    trackingID!:string;

    @Column()
    userFirstName!:string;

    @Column()
    useLastName!:string;

    @Column()
    userPhoneNumber!:string;

    @Column({nullable:true})
    note!: string;

    @Column({
        type: "enum",
        enum: OrderStatusEnum,
    })
    orderStatus!: OrderStatusEnum

    @Column({
        type: "enum",
        enum: OrderTypeEnum,
    })
    type!: OrderTypeEnum

    @Column({
        type: "enum",
        enum: OrderModeConstant,
    })
    mode!: OrderModeConstant

    @Column({type: 'decimal', precision: 10, scale: 2})
    currentFromCurrencyNairaBuyValue!:number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    currentFromCurrencyNairaSellValue!:number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    currentToCurrencyNairaBuyValue!:number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    currentToCurrencyNairaSellValue!:number;

    @ManyToOne(type => Address, address => address.orders)
    address!: Address;

    @ManyToOne(type => AccountDetail, accountDetail => accountDetail.orders,{nullable:true})
    accountDetail!: AccountDetail;

    @ManyToOne(type => PaymentTransaction, pt => pt.order,{nullable:true})
    paymentTransaction!: PaymentTransaction

    @ManyToOne(type => User, user => user.orders)
    user!: User;

    @ManyToOne(type => Currency, currency => currency.order)
    fromCurrency!: Currency

    @ManyToOne(type => Currency, currency => currency.order)
    toCurrency!: Currency
}