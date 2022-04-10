import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {User} from "./user.model";
import {Wallet} from "./wallet.model";
import {Country} from "./country.model";
import {Order} from "./order.model";

@Entity()
export class State extends BaseModel {
    @Column({
        type:'boolean'
    })
    isSupported!:boolean;

    @Column({})
    name!: string;

    @ManyToOne(type => Country, country => country.states)
    country!: Country;

    @OneToMany(type => Order, order => Order)
    order!: Order[];

}