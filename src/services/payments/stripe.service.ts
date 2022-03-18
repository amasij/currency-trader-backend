import {Container, Service} from "typedi";
import {Constants} from "../../constants";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import Stripe from "stripe";

@Service()
export class StripeService {
    private appConfigProperties!: AppConfigurationProperties;
    private stripe!: Stripe;

    constructor() {
        this.appConfigProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
        this.stripe = new Stripe(this.appConfigProperties.stripeApiKey, {
            apiVersion: this.appConfigProperties.stripeApiVersion,
        });

    }

    async createCheckoutSession(): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'T-shirt',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: this.appConfigProperties.stripeSuccessUrl,
            cancel_url: this.appConfigProperties.stripeCancelUrl,
        });
    }
}