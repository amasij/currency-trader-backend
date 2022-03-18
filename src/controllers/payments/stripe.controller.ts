import {RouteConfiguration} from "../../config/routes/route-config";
import express from "express";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {Container} from "typedi";
import {Constants} from "../../constants";
import {StripeService} from "../../services/payments/stripe.service";

export class StripeController extends RouteConfiguration {
    private appConfigurationProperties!: AppConfigurationProperties;
    private stripeService!: StripeService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.stripeService = Container.get(StripeService);
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
    }

    register() {
        this.app.post(`${this.prefix}/create-checkout-session`, (...args) =>
            this.handle(...args, async () => {
                const [req,res] = args;
                const session = await this.stripeService.createCheckoutSession();
                return res.json({id: session.id});
            }));

        return this.app;
    }


}