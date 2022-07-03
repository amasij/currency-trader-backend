import {TransactionStatusConstant} from "../../models/enums/transaction-status-constant";
import {PaymentProviderEnum} from "../../models/enums/payment-provider.enum";
import {IsDefined, IsIn, Min} from "class-validator";
import {Expose} from "class-transformer";

export class PaymentTransactionCreationDto{
    @IsDefined()
    @Expose()
    @Min(1)
    amount!:number;
    @IsDefined()
    @Expose()
    paymentProviderCharge!:number;
    @IsDefined()
    @Expose()
    @IsIn([TransactionStatusConstant.PAID,TransactionStatusConstant.PENDING,TransactionStatusConstant.DECLINED])
    transactionStatus!:TransactionStatusConstant;
    @IsDefined()
    @Expose()
    @IsIn([PaymentProviderEnum.PAYSTACK,PaymentProviderEnum.STRIPE])
    paymentProvider!:PaymentProviderEnum;
    @IsDefined()
    @Expose()
    paymentProviderReference!:string;
    @IsDefined()
    @Expose()
    description!: string;
}