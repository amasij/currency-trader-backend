import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {AccountDetail} from "./account-detail.model";

@Entity()
export class Bank extends BaseModel {

    @Column()
    name!: string;
    @OneToMany(type => AccountDetail, accountDetail => accountDetail.bank)
    accountDetails!: AccountDetail[];

}