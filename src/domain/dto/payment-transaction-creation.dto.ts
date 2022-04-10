import {WalletCurrencyBalance} from "../../models/entity/wallet-currency-balance.model";
import {TransactionStatusConstant} from "../../models/enums/transaction-status-constant";
import {PaymentProviderConstant} from "../../models/enums/payment-provider-constant";
import {TransactionTypeConstant} from "../../models/enums/transaction-type-constant";

export class PaymentTransactionCreationDto{
    walletCurrencyBalance!:WalletCurrencyBalance;
    amount!:number;
    transactionStatus!:TransactionStatusConstant;
    paymentProvider!:PaymentProviderConstant;
    paymentProviderReference!:string;
    description!: string;
    transactionType!:TransactionTypeConstant;
}