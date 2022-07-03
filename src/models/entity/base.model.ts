import {Column, PrimaryGeneratedColumn} from "typeorm";
import {StatusEnum} from "../enums/status.enum";

export class BaseModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'timestamptz', default: new Date()})
    dateCreated: Date = new Date();

    @Column({
        type: "enum",
        enum: StatusEnum,
        default: StatusEnum.ACTIVE
    })
    status: StatusEnum = StatusEnum.ACTIVE;

    @Column({unique:true})
    code!: string;
}