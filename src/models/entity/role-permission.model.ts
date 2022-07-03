import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {Role} from "./role.model";
import {Permission} from "./permission.model";

@Entity()
export class RolePermission extends BaseModel {
    @ManyToOne(type => Role, role => role.rolePermissions)
    role!: Role;

    @ManyToOne(type => Permission, permission => permission.rolePermissions)
    permission!: Permission;

}