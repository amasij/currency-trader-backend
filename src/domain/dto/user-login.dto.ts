import {IsDefined, Matches} from "class-validator";
import {Expose} from "class-transformer";

export class UserLoginDto {
    @IsDefined()
    @Expose()
    password!: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    email!: string;
}

