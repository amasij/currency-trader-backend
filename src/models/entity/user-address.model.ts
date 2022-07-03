import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {User} from "./user.model";
import {Address} from "./address.model";

@Entity()
export class UserAddress extends BaseModel {

    @ManyToOne(type => User, user => user.userAddresses)
    user!: User;

    @ManyToOne(type => Address, address => address.userAddresses)
    address!: Address;

}