import {IsDefined, IsMobilePhone, Matches, MaxLength, Min, MIN, MinLength} from "class-validator";
import {Expose} from "class-transformer";

export class OrderCreationDto {
    @IsDefined()
    @Expose()
    currencyCode!: string;

    address!: string;
    domAccount!: string;

    @IsDefined()
    @Expose()
    name!: string;

    @IsDefined()
    @Expose()
    @Matches(RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),{message:'Not a valid email'})
    email!: string;

    @IsDefined()
    @Expose()
    @IsMobilePhone()
    @MinLength(11)
    @MaxLength(14)
    phoneNumber!: string;

    stateCode!: string;

    @IsDefined()
    @Expose()
    paymentProviderReference!: string;
}