import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {StatusConstant} from "../enums/status-constant";

export class BaseModel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'timestamptz'})
    dateCreated!: Date;

    @Column({
        type: "enum",
        enum: StatusConstant,
    })
    status!: StatusConstant;

    @Column()
    code!: string;
}