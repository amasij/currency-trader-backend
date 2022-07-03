import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {BaseModel} from "./base.model";
import {RolePermission} from "./role-permission.model";
import {UserRole} from "./user-role.model";

@Entity()
export class Role extends BaseModel {

    @Column({})
    name!: string;

    @Column({})
    description!: string;

    @OneToMany(type => RolePermission, rolePermission => rolePermission.role)
    rolePermissions!: RolePermission[];

    @OneToMany(type => UserRole, userRole => userRole.role)
    userRoles!: UserRole[];

}