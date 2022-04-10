import {WalletCurrencyBalance} from "../../models/entity/wallet-currency-balance.model";
import {TransactionStatusConstant} from "../../models/enums/transaction-status-constant";
import {PaymentProviderConstant} from "../../models/enums/payment-provider-constant";
import {TransactionTypeConstant} from "../../models/enums/transaction-type-constant";
import {IsDefined, IsIn, Min} from "class-validator";
import {Expose} from "class-transformer";

export class PaymentTransactionCreationDto{
    walletCurrencyBalance!:WalletCurrencyBalance;
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
    @IsIn([PaymentProviderConstant.PAYSTACK,PaymentProviderConstant.STRIPE])
    paymentProvider!:PaymentProviderConstant;
    @IsDefined()
    @Expose()
    paymentProviderReference!:string;
    @IsDefined()
    @Expose()
    description!: string;
    @IsDefined()
    @Expose()
    @IsIn([TransactionTypeConstant.CURRENCY_PURCHASE,TransactionTypeConstant.WALLET_CREDIT,TransactionTypeConstant.WALLET_DEBIT])
    transactionType!:TransactionTypeConstant;
}