import {Container, Service} from "typedi";
import {OrderCreationDto} from "../../domain/dto/order-creation.dto";
import {AppRepository} from "../../repositories/app.repository";
import {Order} from "../../models/entity/order.model";
import {OrderStatusEnum} from "../../models/enums/order-status.enum";
import {StatusEnum} from "../../models/enums/status.enum";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {OrderCreationPojo} from "../../domain/pojo/order-creation.pojo";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {PaystackService} from "../payments/paystack.service";
import {PaymentTransactionService} from "../payments/payment-transaction.service";
import {PaymentTransaction} from "../../models/entity/payment-transaction.model";
import {PaymentTransactionCreationDto} from "../../domain/dto/payment-transaction-creation.dto";
import {TransactionStatusConstant} from "../../models/enums/transaction-status-constant";
import {
    PaystackTransactionVerificationResponse
} from "../../domain/interface/payments/paystack-transaction-verification.interface";
import {PaymentProviderEnum} from "../../models/enums/payment-provider.enum";
import {User} from "../../models/entity/user.model";
import {Constants} from "../../constants";
import {Utils} from "../../utils/utils";
import {Currency} from "../../models/entity/currency.model";
import {MailService} from "../mail.service";
import {SettingService} from "../setting.service";
import {State} from "../../models/entity/state.model";
import {ErrorResponse} from "../../config/error/error-response";
import {HttpStatusCode} from "../../domain/enums/http-status-code";

@Service()
export class OrderService {
    constructor(private appRepository: AppRepository,
                private paystackService: PaystackService,
                private mailService: MailService,
                private settingService: SettingService,
                private paymentTransactionService: PaymentTransactionService,
                private sequenceService: SequenceGeneratorService) {
    }

    @Transactional()
    public async createOrder(dto: OrderCreationDto): Promise<OrderCreationPojo> {
        const currency: Currency = await this.appRepository.getRepository(Currency).findOneOrFail({code: dto.currencyCode}).catch(e => {
            throw new ErrorResponse({
                code: HttpStatusCode.BAD_REQUEST,
                description: 'Cannot find currency with code [' + dto.currencyCode + ']'
            });
        });
        const paystackResponse = await this.paystackService.validatePayment(dto.paymentProviderReference);
        const order: Order = new Order();
        order.orderStatus = OrderStatusEnum.PENDING;
        order.amount = paystackResponse.data?.amount! / currency.nairaSellValue;
        order.status = StatusEnum.ACTIVE;
        order.code = await this.sequenceService.getNextValue(Order.name, 'ORD');

        order.paymentTransaction = await this.createPaymentTransaction(dto, paystackResponse, currency);
        const savedOrder = await this.appRepository.getRepository(Order).save(order);
        this.sendOrderCreationMail(savedOrder, dto.name, dto.email, currency);
        return new OrderCreationPojo('');
    }

    private async sendOrderCreationMail(order: Order, name: string, email: string, currency: Currency) {
        this.mailService.sendMail({
            locals: {
                firstName: name,
                currencySymbol: currency.symbol,
                amount: Utils.formatCurrency(order.amount),
                orderStatus: order.orderStatus,
                hasDomAccount: false,
                domAccount: '',
                address: order.address,
                deliveryTime: await this.settingService.getNumber(Constants.CURRENCY_DELIVERY_TIME_IN_HOURS, 24)
            },
            to: email,
            subject: 'Order Confirmation',
            template: 'orders/order-creation.template'
        })
    }

    private async createPaymentTransaction(orderCreationDto: OrderCreationDto, paystackResponse: PaystackTransactionVerificationResponse, currency: Currency): Promise<PaymentTransaction> {
        const dto = new PaymentTransactionCreationDto();
        dto.transactionStatus = TransactionStatusConstant.PAID;
        dto.paymentProviderReference = orderCreationDto.paymentProviderReference;
        dto.amount = this.paystackService.getTotalAmountPaid(paystackResponse);
        dto.paymentProviderCharge = this.paystackService.getPaystackCharges(paystackResponse);
        dto.description = `Purchase of currency [₦${dto.amount}/ ₦${currency.nairaSellValue} = ${currency.symbol}${(dto.amount) / currency.nairaSellValue}]`;
        dto.paymentProvider = PaymentProviderEnum.PAYSTACK;
        return this.paymentTransactionService.createPaymentTransaction(dto);
    }
}