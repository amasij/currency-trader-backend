import {Container, Service} from "typedi";
import {PaymentTransaction} from "../../models/entity/payment-transaction.model";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {AppRepository} from "../../repositories/app.repository";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {StatusConstant} from "../../models/enums/status-constant";
import {PaymentTransactionCreationDto} from "../../domain/dto/payment-transaction-creation.dto";
import {MailService} from "../mail.service";
import {Constants} from "../../constants";
import {User} from "../../models/entity/user.model";
import crypto from "crypto";
import {ErrorResponse} from "../../config/error/error-response";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {formatCurrency} from "../../utils/utils";

@Service()
export class PaymentTransactionService {

    constructor(private appRepository: AppRepository,
                private mailService: MailService,
                private sequenceGenerator: SequenceGeneratorService) {

    }

    public static generateTransactionReference(): string {
        return crypto.randomUUID();
    }

    private async isDuplicateTransaction(paymentProviderReference: string): Promise<boolean> {
        return !!await this.appRepository.getRepository(PaymentTransaction).createQueryBuilder('payment_transaction')
            .where("LOWER(payment_transaction.paymentProviderPaymentReference) = :paymentProviderReference AND status = :status", {
                paymentProviderReference,
                status: StatusConstant.ACTIVE
            }).getOne();
    }

    @Transactional()
    public async createPaymentTransaction(dto: PaymentTransactionCreationDto): Promise<PaymentTransaction> {
        if (await this.isDuplicateTransaction(dto.paymentProviderReference.trim())) {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Duplicate transaction'});
        }
        const loggedInUser = Container.get(Constants.LOGGED_IN_USER) as User;
        const pt = new PaymentTransaction();
        pt.paymentProvider = dto.paymentProvider;
        pt.status = StatusConstant.ACTIVE;
        pt.dateCreated = new Date();
        pt.amount = dto.amount;
        pt.description = dto.description;
        pt.transactionType = dto.transactionType;
        pt.walletCurrencyBalance = dto.walletCurrencyBalance;
        pt.paymentReference = PaymentTransactionService.generateTransactionReference();
        pt.paymentProviderPaymentReference = dto.paymentProviderReference.trim();
        pt.code = await this.sequenceGenerator.getNextValue(PaymentTransaction.name, 'PTC');
        pt.transactionStatus = dto.transactionStatus;
        const savedTransaction = await this.appRepository.getRepository(PaymentTransaction).save(pt);
        this.sendTransactionCreationMail(loggedInUser, dto, savedTransaction);
        return savedTransaction;
    }

    private sendTransactionCreationMail(loggedInUser: User, dto: PaymentTransactionCreationDto, paymentTransaction: PaymentTransaction) {
        this.mailService.sendMail({
            locals: {
                firstName: loggedInUser.firstName,
                transactionType: dto.transactionType,
                amount: formatCurrency(dto.walletCurrencyBalance.currency.code,paymentTransaction.amount),
                currencySymbol: dto.walletCurrencyBalance.currency.symbol,
                transactionStatus: paymentTransaction.transactionStatus,
                currencyName: dto.walletCurrencyBalance.currency.name,

            },
            to: loggedInUser.email,
            subject: `Payment Transaction Notification on ${dto.walletCurrencyBalance.currency.name} wallet`,
            template: 'payments/payment-transaction.template'
        });
    }
}