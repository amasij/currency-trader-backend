import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {State} from "./state.model";

@Entity()
export class Country extends BaseModel {
    @Column()
    alpha2!: string;

    @Column({})
    name!: string;

    @Column({
        type:'boolean'
    })
    isSupported!:boolean;

    @OneToMany(type => State, state => state.country)
    states!: State[];
}