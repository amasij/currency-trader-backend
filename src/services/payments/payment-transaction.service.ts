import {Container, Service} from "typedi";
import {PaymentTransaction} from "../../models/entity/payment-transaction.model";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {AppRepository} from "../../repositories/app.repository";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {StatusEnum} from "../../models/enums/status.enum";
import {PaymentTransactionCreationDto} from "../../domain/dto/payment-transaction-creation.dto";
import {MailService} from "../mail.service";
import {Constants} from "../../constants";
import {User} from "../../models/entity/user.model";
import {ErrorResponse} from "../../config/error/error-response";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {Utils} from "../../utils/utils";

@Service()
export class PaymentTransactionService {

    constructor(private appRepository: AppRepository,
                private mailService: MailService,
                private sequenceGenerator: SequenceGeneratorService) {

    }

    public static generateTransactionReference(): string {
        return Utils.generateReference();
    }

    private async isDuplicateTransaction(paymentProviderReference: string): Promise<boolean> {
        return !!await this.appRepository.getRepository(PaymentTransaction).createQueryBuilder('payment_transaction')
            .where("LOWER(payment_transaction.paymentProviderPaymentReference) = :paymentProviderReference AND status = :status", {
                paymentProviderReference,
                status: StatusEnum.ACTIVE
            }).getOne();
    }

    @Transactional()
    public async createPaymentTransaction(dto: PaymentTransactionCreationDto): Promise<PaymentTransaction> {
        await Utils.validateClass(dto, 'Unable to create payment transaction. Bad internal data');

        if (await this.isDuplicateTransaction(dto.paymentProviderReference.trim())) {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Duplicate transaction'});
        }
        const pt = new PaymentTransaction();
        pt.paymentProvider = dto.paymentProvider;
        pt.status = StatusEnum.ACTIVE;
        pt.dateCreated = new Date();
        pt.amount = dto.amount;
        pt.description = dto.description;
        pt.paymentProviderCharge = dto.paymentProviderCharge;
        pt.paymentReference = PaymentTransactionService.generateTransactionReference();
        pt.paymentProviderPaymentReference = dto.paymentProviderReference.trim();
        pt.code = await this.sequenceGenerator.getNextValue(PaymentTransaction.name, 'PTC');
        pt.transactionStatus = dto.transactionStatus;
        const savedTransaction = await this.appRepository.getRepository(PaymentTransaction).save(pt);
        return savedTransaction;
    }

    private sendTransactionCreationMail(loggedInUser: User, dto: PaymentTransactionCreationDto, paymentTransaction: PaymentTransaction) {
        this.mailService.sendMail({
            locals: {


            },
            to: loggedInUser.email,
            subject: `Payment Transaction Notification on  wallet`,
            template: 'payments/payment-transaction.template'
        });
    }
}