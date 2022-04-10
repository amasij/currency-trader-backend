import {Container, Service} from "typedi";
import {OrderCreationDto} from "../../domain/dto/order-creation.dto";
import {AppRepository} from "../../repositories/app.repository";
import {Order} from "../../models/entity/order.model";
import {OrderStatusConstant} from "../../models/enums/order-status-constant";
import {StatusConstant} from "../../models/enums/status-constant";
import {SequenceGeneratorService} from "../sequence-generator.service";
import {OrderCreationPojo} from "../../domain/pojo/order-creation.pojo";
import {Transactional} from "typeorm-transactional-cls-hooked";
import {PaystackService} from "../payments/paystack.service";
import {PaymentTransactionService} from "../payments/payment-transaction.service";
import {PaymentTransaction} from "../../models/entity/payment-transaction.model";
import {PaymentTransactionCreationDto} from "../../domain/dto/payment-transaction-creation.dto";
import {TransactionTypeConstant} from "../../models/enums/transaction-type-constant";
import {TransactionStatusConstant} from "../../models/enums/transaction-status-constant";
import {
    PaystackTransactionVerificationResponse
} from "../../domain/interface/payments/paystack-transaction-verification.interface";
import {PaymentProviderConstant} from "../../models/enums/payment-provider-constant";
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
        const loggedInUser: User = Container.get(Constants.LOGGED_IN_USER);
        const currency: Currency = await this.appRepository.getRepository(Currency).findOneOrFail({code: dto.currencyCode}).catch(e => {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Cannot find currency with code ['+dto.currencyCode+']'});
        });
        const paystackResponse = await this.paystackService.validatePayment(dto.paymentProviderReference);
        const order: Order = new Order();
        order.orderStatus = OrderStatusConstant.PENDING;
        order.amount = paystackResponse.data?.amount! / currency.nairaValue;
        order.status = StatusConstant.ACTIVE;
        order.code = await this.sequenceService.getNextValue(Order.name, 'ORD');
        if (dto.address) {
            order.state = await this.appRepository.getRepository(State).findOneOrFail({code: dto.stateCode}).catch(e => {
                throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Cannot find state with code ['+dto.stateCode+']'});
            });
            order.address = dto.address;
        }
        if (dto.domAccount) {
            order.domAccount = dto.domAccount;
        }
        order.paymentTransaction = await this.createPaymentTransaction(dto, paystackResponse, currency);
        order.currencyNairaValue = currency.nairaValue;
        order.customerFirstName = loggedInUser.firstName;
        order.customerLastName = loggedInUser.lastName;
        order.customerPhoneNumber = loggedInUser.phoneNumber;
        order.user = loggedInUser;
        order.dateCreated = new Date();
        order.reference = Utils.generateReference();
        order.currency = currency;
        const savedOrder = await this.appRepository.getRepository(Order).save(order);
        this.sendOrderCreationMail(savedOrder, loggedInUser, currency);
        return new OrderCreationPojo(order.reference);
    }

    private async sendOrderCreationMail(order: Order, loggedInUser: User, currency: Currency) {
        this.mailService.sendMail({
            locals: {
                firstName: loggedInUser.firstName,
                currencySymbol: currency.symbol,
                amount: Utils.formatCurrency(order.amount),
                orderStatus: order.orderStatus,
                hasDomAccount: !!order.domAccount,
                domAccount: order.domAccount,
                address: order.address,
                deliveryTime: await this.settingService.getNumber(Constants.CURRENCY_DELIVERY_TIME_IN_HOURS, 24)
            },
            to: loggedInUser.email,
            subject: 'Order Confirmation',
            template: 'orders/order-creation.template'
        })
    }

    private async createPaymentTransaction(orderCreationDto: OrderCreationDto, paystackResponse: PaystackTransactionVerificationResponse, currency: Currency): Promise<PaymentTransaction> {
        const dto = new PaymentTransactionCreationDto();
        dto.transactionType = TransactionTypeConstant.CURRENCY_PURCHASE;
        dto.transactionStatus = TransactionStatusConstant.PAID;
        dto.paymentProviderReference = orderCreationDto.paymentProviderReference;
        dto.amount = this.paystackService.getTotalAmountPaid(paystackResponse);
        dto.paymentProviderCharge = this.paystackService.getPaystackCharges(paystackResponse);
        dto.description = `Purchase of currency [₦${dto.amount}/ ₦${currency.nairaValue} = ${currency.symbol}${(dto.amount) / currency.nairaValue}]`;
        dto.paymentProvider = PaymentProviderConstant.PAYSTACK;
        return this.paymentTransactionService.createPaymentTransaction(dto);
    }
}