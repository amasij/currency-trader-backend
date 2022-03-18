import Axios, {AxiosResponse} from "axios";
import {
    PaystackTransactionVerificationResponse
} from "../../domain/interface/payments/paystack-transaction-verification.interface";

export class PayStackApiClient {
    static verifyTransaction(reference: string, paystackSecretKey: string): Promise<AxiosResponse<PaystackTransactionVerificationResponse>> {
        return Axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`
            }
        });
    }
}