import {Column, Entity, ManyToOne} from "typeorm";
import {BaseModel} from "./base.model";
import {User} from "./user.model";
import {Address} from "./address.model";
import {Role} from "./role.model";

@Entity()
export class UserRole extends BaseModel {

    @ManyToOne(type => User, user => user.userRoles)
    user!: User;

    @ManyToOne(type => Role, role => role.userRoles)
    role!: Role;

}