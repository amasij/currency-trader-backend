import {Column, Entity} from "typeorm";
import {BaseModel} from "./base.model";

@Entity()
export class Setting extends BaseModel {
    @Column()
    name!: string;

    @Column()
    value!: string;
}