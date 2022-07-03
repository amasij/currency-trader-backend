import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseModel} from "./base.model";
import {Order} from "./order.model";
import {UserAddress} from "./user-address.model";

@Entity()
export class Address extends BaseModel {

    @Column()
    description!: string;

    @Column()
    stateCode!: string;

    @OneToMany(type => UserAddress, userAddress => userAddress.address)
    userAddresses!: UserAddress[];

    @OneToMany(type => Order, order => order.address)
    orders!: Order[];


}