import {IsDefined, IsIn, Min} from "class-validator";
import {Expose} from "class-transformer";
import {PaymentProviderConstant} from "../../models/enums/payment-provider-constant";

export class WalletCreditDto{
    @IsDefined()
    @Expose()
    walletCurrencyBalanceCode!:string;

    @IsDefined()
    @Expose()
    paymentReference!:string;

    @IsDefined()
    @Expose()
    @IsIn([PaymentProviderConstant.STRIPE,PaymentProviderConstant.PAYSTACK])
    paymentProvider!:PaymentProviderConstant;

}