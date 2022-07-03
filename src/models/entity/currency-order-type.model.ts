import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {Currency} from "./currency.model";
import {OrderTypeEnum} from "../enums/order-type.enum";

@Entity()
export class CurrencyOrderType extends BaseModel {

    @ManyToOne(type => Currency, currency => currency.currencyOrderTypes)
    currency!: Currency;

    @Column({
        type: "enum",
        enum: OrderTypeEnum
    })
    type!: OrderTypeEnum;

}