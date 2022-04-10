import {Container, Service} from "typedi";
import {PayStackApiClient} from "../../integrations/payments/paystack-api-client";
import {Constants} from "../../constants";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {ErrorResponse} from "../../config/error/error-response";
import {HttpStatusCode} from "../../domain/enums/http-status-code";
import {
    PaystackTransactionVerificationResponse
} from "../../domain/interface/payments/paystack-transaction-verification.interface";

@Service()
export class PaystackService {
    private appConfigProperties!: AppConfigurationProperties;

    constructor() {
        this.appConfigProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
    }

    async verifyReference(reference: string): Promise<PaystackTransactionVerificationResponse> {
        if (!reference) {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Reference is required'});
        }
        const response = await PayStackApiClient.verifyTransaction(reference, this.appConfigProperties.payStackSecretKey).catch(e => {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: e.response.data?.['message']});
        });

        return response.data;
    }

    public async validatePayment(paymentReference: string): Promise<PaystackTransactionVerificationResponse> {
        const paystackResponse = await this.verifyReference(paymentReference);
        if (!this.isSuccessfulPayment(paystackResponse)) {
            throw new ErrorResponse({code: HttpStatusCode.BAD_REQUEST, description: 'Payment was not successful. Please try again later.'});
        }
        return paystackResponse;
    }

    public getTotalAmountPaid(paystackResponse: PaystackTransactionVerificationResponse):number{
        return paystackResponse.data?.amount??0;
    }

    public getPaystackCharges(paystackResponse: PaystackTransactionVerificationResponse):number{
        return paystackResponse.data?.fees??0;
    }

    private isSuccessfulPayment(paystackResponse: PaystackTransactionVerificationResponse): boolean {
        return paystackResponse.data?.status === 'success';
    }
}