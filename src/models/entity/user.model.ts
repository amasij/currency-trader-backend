import {Column, Entity, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {Order} from "./order.model";
import {UserAddress} from "./user-address.model";
import {UserAccountDetail} from "./user-account-detail.model";
import {UserRole} from "./user-role.model";

@Entity()
export class User extends BaseModel {

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    password!: string;

    @Column({
        unique: true
    })
    email!: string;

    @Column({
        default: false
    })
    emailVerified!: boolean;

    @Column({
        unique: true
    })
    phoneNumber!: string;


    @OneToMany(type => UserAddress, userAddress => userAddress.user)
    userAddresses!: UserAddress[];

    @OneToMany(type => UserAccountDetail, userAccountDetail => userAccountDetail.user)
    userAccountDetail!: UserAccountDetail[];

    @OneToMany(type => Order, order => order.user)
    orders!: Order[];

    @OneToMany(type => UserRole, userRole => userRole.user)
    userRoles!: UserRole[];


}