import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {Order} from "./order.model";
import {AccountDetail} from "./account-detail.model";
import {CurrencyOrderType} from "./currency-order-type.model";

@Entity()
export class Currency extends BaseModel {

    @Column()
    name!: string;

    @Column()
    symbol!: string;

    @Column()
    supported!: boolean;

    @Column({type: 'decimal', precision: 10, scale: 2})
    nairaSellValue!: number;

    @Column({type: 'decimal', precision: 10, scale: 2})
    nairaBuyValue!: number;


    @OneToMany(type => AccountDetail, accountDetail => accountDetail.currency)
    accountDetails!: AccountDetail[];

    @OneToMany(type => Order, order => Order)
    order!: Order[];

    @OneToMany(type => CurrencyOrderType, currencyOrderType => currencyOrderType.currency)
    currencyOrderTypes!: CurrencyOrderType[];
}