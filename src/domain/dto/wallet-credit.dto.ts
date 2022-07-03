import {IsDefined, IsIn, Min} from "class-validator";
import {Expose} from "class-transformer";
import {PaymentProviderEnum} from "../../models/enums/payment-provider.enum";

export class WalletCreditDto{
    @IsDefined()
    @Expose()
    walletCurrencyBalanceCode!:string;

    @IsDefined()
    @Expose()
    paymentReference!:string;

    @IsDefined()
    @Expose()
    @IsIn([PaymentProviderEnum.STRIPE,PaymentProviderEnum.PAYSTACK])
    paymentProvider!:PaymentProviderEnum;

}