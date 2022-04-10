import {IsDefined, Min, MIN} from "class-validator";
import {Expose} from "class-transformer";

export class OrderCreationDto {
    @IsDefined()
    @Expose()
    currencyCode!: string;

    address!: string;
    domAccount!:string;

    @IsDefined()
    @Expose()
    stateCode!: string;

    @IsDefined()
    @Expose()
    paymentProviderReference!: string;
}