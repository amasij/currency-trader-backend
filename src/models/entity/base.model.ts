import {Column, PrimaryGeneratedColumn} from "typeorm";
import {StatusConstant} from "../enums/status-constant";

export class BaseModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'timestamptz', default: new Date()})
    dateCreated: Date = new Date();

    @Column({
        type: "enum",
        enum: StatusConstant,
        default: StatusConstant.ACTIVE
    })
    status: StatusConstant = StatusConstant.ACTIVE;

    @Column({unique:true})
    code!: string;
}