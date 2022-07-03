import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {User} from "./user.model";
import {AccountDetail} from "./account-detail.model";

@Entity()
export class UserAccountDetail extends BaseModel {

    @ManyToOne(type => User, user => user.userAccountDetail)
    user!: User;

    @ManyToOne(type => AccountDetail, accountDetail => accountDetail.userAccountDetails)
    accountDetail!: AccountDetail;

}