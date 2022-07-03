import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {Country} from "./country.model";
import {Order} from "./order.model";
import {RolePermission} from "./role-permission.model";

@Entity()
export class Permission extends BaseModel {


    @Column({})
    name!: string;

    @Column({})
    description!: string;

    @OneToMany(type => RolePermission, rolePermission => rolePermission.permission)
    rolePermissions!: RolePermission[];

}