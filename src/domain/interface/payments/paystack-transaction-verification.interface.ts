export interface PaystackTransactionVerificationResponse {
    status?: boolean;
    message?: string;
    data?: {
        amount?: number;
        currency?: string;
        transaction_date?: Date;
        status?: string;
        reference?: string;
        domain?: string,
        metadata?: number,
        gateway_response?: string,
        message?: any;
        channel?: string,
        ip_address?: string,
        log?: {
            time_spent?: number;
            attempts?: number;
            authentication?: any;
            errors?: number;
            success?: boolean;
            mobile?: boolean;
            input?: [];
            channel?: any;
            history?: {
                type?: string
                message?: string;
                time?: number;
            }[];
        }
        fees?: any;
        authorization?: {
            authorization_code?: string;
            card_type?: string;
            last4?: string;
            exp_month?: string;
            exp_year?: string;
            bin?: string;
            bank?: string;
            channel?: string;
            signature?: string;
            reusable?: true,
            country_code?: string;
            account_name?: string;
        },
        "customer"?: {
            id?: 84312,
            customer_code?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
        },
        plan?: string;
        requested_amount?: number;
    }

}