import {RouteConfiguration} from "../../config/routes/route-config";
import express from "express";
import crypto from "crypto";
import {AppConfigurationProperties} from "../../config/app-configuration-properties";
import {Container} from "typedi";
import {Constants} from "../../constants";
import {PaystackService} from "../../services/payments/paystack.service";
import {HttpStatusCode} from "../../domain/enums/http-status-code";

export class PaystackController extends RouteConfiguration {
    private appConfigurationProperties!: AppConfigurationProperties;
    private paystackService!: PaystackService;

    constructor(app: express.Application,
                private prefix: string = '') {
        super(app, prefix);
        this.paystackService = Container.get(PaystackService);
        this.appConfigurationProperties = Container.get(Constants.APP_CONFIGURATION_PROPERTIES);
    }

    register() {
        this.app.post(`${this.prefix}/webhook`, (...args) =>
            this.handle(...args,  () => {
                const [req, res] = args;
                const hash = crypto.createHmac('sha512', this.appConfigurationProperties.payStackSecretKey)
                    .update(JSON.stringify(req.body)).digest('hex');
                if (hash == req.headers['x-paystack-signature']) {
                    const event = req.body;
                }
                return res.sendStatus(200);
            }));


        this.app.get(`${this.prefix}/verify/:reference`, (...args) =>
            this.handle(...args, async () => {
                const [req, res] = args;
                const reference: string = req.params.reference;
                const data = await this.paystackService.verifyReference(reference);
                return res.status(HttpStatusCode.OK).json(data);
            }));

        return this.app;
    }
}