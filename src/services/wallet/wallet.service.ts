import {Service} from "typedi";
import {AppRepository} from "../../repositories/app.repository";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {Wallet} from "../../models/entity/wallet.model";
import {User} from "../../models/entity/user.model";
import {StatusConstant} from "../../models/enums/status-constant";
import {WalletCurrencyBalance} from "../../models/entity/wallet-currency-balance.model";
import {Currency} from "../../models/entity/currency.model";
import {UserWallet} from "../../models/entity/user-wallet.model";
import {WalletCreditDto} from "../../domain/dto/wallet-credit.dto";
import {PaystackService} from "../payments/paystack.service";
import {ErrorResponse} from "../../config/error/error-response";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {WalletCreditPojo} from "../../domain/pojo/wallet-credit-pojo";
import {PaymentTransaction} from "../../models/entity/payment-transaction.model";
import {PaymentTransactionService} from "../payments/payment-transaction.service";
import {PaymentTransactionCreationDto} from "../../domain/dto/payment-transaction-creation.dto";
import {
    PaystackTransactionVerificationResponse
} from "../../domain/interface/payments/paystack-transaction-verification.interface";
import {TransactionTypeConstant} from "../../models/enums/transaction-type-constant";
import {TransactionStatusConstant} from "../../models/enums/transaction-status-constant";
import {PaymentProviderConstant} from "../../models/enums/payment-provider-constant";

@Service()
export class WalletService {
    constructor(private appRepository: AppRepository,
                private payStackService: PaystackService,
                private paymentTransactionService: PaymentTransactionService,
                private sequenceService: SequenceGeneratorService) {

    }

    @Transactional()
    async createWallet(user: User, name: string): Promise<Wallet> {
        const wallet: Wallet = new Wallet();
        wallet.code = await this.sequenceService.getNextValue(Wallet.name, 'WA');
        wallet.name = name;
        wallet.status = StatusConstant.ACTIVE;
        wallet.dateCreated = new Date();
        const savedWallet: Wallet = await this.appRepository.getRepository(Wallet).save(wallet);
        await this.createDefaultWalletCurrencyBalance(savedWallet);
        await this.createUserWallet(user, savedWallet);
        return savedWallet;
    }

    private async createUserWallet(user: User, wallet: Wallet) {
        const userWallet: UserWallet = new UserWallet();
        userWallet.wallet = wallet;
        userWallet.user = user;
        userWallet.code = await this.sequenceService.getNextValue(UserWallet.name, 'UW');
        await this.appRepository.getRepository(UserWallet).save(userWallet);
    }

    private async createDefaultWalletCurrencyBalance(wallet: Wallet) {
        const wcb: WalletCurrencyBalance = new WalletCurrencyBalance();
        wcb.currency = await this.appRepository.connection.getRepository(Currency).findOneOrFail({code: 'NGN'});
        wcb.code = await this.sequenceService.getNextValue(Wallet.name, 'WCB');
        wcb.wallet = wallet;
        wcb.amount = 0;
        await this.appRepository.getRepository(WalletCurrencyBalance).save(wcb);

    }

    @Transactional()
    public async creditWallet(dto: WalletCreditDto): Promise<WalletCreditPojo> {
        const wcbRepository = this.appRepository.getRepository(WalletCurrencyBalance);
        const wcb = await wcbRepository.findOneOrFail({code: dto.walletCurrencyBalanceCode});
        const paystackResponse = await this.payStackService.validatePayment(dto.paymentReference);
        const savedWcb = await this.updateWalletCurrencyBalance(wcb, paystackResponse.data?.amount ?? 0, TransactionTypeConstant.WALLET_CREDIT);
        const paymentTransaction = await this.createPaymentTransaction(savedWcb, paystackResponse,TransactionTypeConstant.WALLET_CREDIT);
        const walletCreditPojo = new WalletCreditPojo();
        walletCreditPojo.paymentTransactionReference = paymentTransaction.paymentReference;
        return walletCreditPojo;
    }

    private async updateWalletCurrencyBalance(wcb: WalletCurrencyBalance, amount: number, type: TransactionTypeConstant): Promise<WalletCurrencyBalance> {
        const currentBalance:number = parseInt(wcb.amount.toString());
        const newAmount:number = parseInt(amount.toString());
        if (type == TransactionTypeConstant.WALLET_CREDIT) {
            wcb.amount = currentBalance + newAmount;
        }
        if (type == TransactionTypeConstant.WALLET_DEBIT) {
            if (currentBalance < newAmount) {
                throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Insufficient funds'});
            }
            wcb.amount = currentBalance - newAmount;
        }
        const savedWcb = await this.appRepository.getRepository(WalletCurrencyBalance).save(wcb);
        return await this.appRepository.connection.createQueryBuilder('wallet_currency_balance','wcb')
            .innerJoinAndSelect('wcb.currency','c')
            .where('wcb.code= :code',{code:savedWcb.code})
            .getOne() as WalletCurrencyBalance;
    }

    private async createPaymentTransaction(wcb: WalletCurrencyBalance, paystackResponse: PaystackTransactionVerificationResponse, transactionType: TransactionTypeConstant): Promise<PaymentTransaction> {
        const dto = {
            walletCurrencyBalance: wcb,
            amount: paystackResponse.data?.amount,
            description: `Transaction on wallet balance with code [${wcb.code}]`,
            transactionStatus: paystackResponse.data?.status === 'success' ? TransactionStatusConstant.PAID : TransactionStatusConstant.PENDING,
            paymentProvider: PaymentProviderConstant.PAYSTACK,
            paymentProviderReference:paystackResponse.data?.reference,
            transactionType
        } as PaymentTransactionCreationDto;
        return await this.paymentTransactionService.createPaymentTransaction(dto);
    }


}