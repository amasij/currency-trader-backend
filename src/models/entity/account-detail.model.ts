import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {Bank} from "./bank.model";
import {Currency} from "./currency.model";
import {UserAccountDetail} from "./user-account-detail.model";
import {AccountTypeConstant} from "../enums/account-type.enum";
import {Order} from "./order.model";

@Entity()
export class AccountDetail extends BaseModel {

    @Column({nullable: false})
    username!: string;

    @Column({nullable: false})
    BVN!: string;

    @Column({nullable: false})
    firstName!: string;

    @Column({nullable: false})
    lastName!: string;

    @Column({nullable: false})
    accountNumber!: string;

    @Column({
        type: "enum",
        enum: AccountTypeConstant
    })
    accountType!: AccountTypeConstant;

    @ManyToOne(type => Currency, currency => currency.accountDetails)
    currency!: Currency;

    @ManyToOne(type => Bank, bank => bank.accountDetails)
    bank!: Bank;

    @OneToMany(type => UserAccountDetail, userAccountDetail => userAccountDetail.accountDetail)
    userAccountDetails!: UserAccountDetail[];

    @OneToMany(type => Order, order => order.accountDetail)
    orders!: Order[];

}