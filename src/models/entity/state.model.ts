import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {User} from "./user.model";
import {Wallet} from "./wallet.model";
import {Country} from "./country.model";

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

}