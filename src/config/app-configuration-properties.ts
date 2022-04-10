import {Stripe} from "stripe";

export class AppConfigurationProperties {
    payStackSecretKey!: string;
    databaseEngine!:string;
    databaseUsername!:string;
    databasePassword!:string;
    databaseName!:string;
    databaseHost!:string;
    databasePort!:number;
    serverPort!:number;
    stripeApiKey!:string;
    stripeApiVersion!:Stripe.LatestApiVersion;
    stripeSuccessUrl!:string;
    stripeCancelUrl!:string;
    mailHostName!:string;
    mailUsername!:string;
    googleAppPassword!:string;
    mailPort!:number;
    jwtSecret!:string;
    jwtExpiry!:string;

    constructor() {
        this.payStackSecretKey = process.env["PAYSTACK_SECRET_KEY"]!;
        this.stripeApiKey = process.env["STRIPE_TEST_KEY"]!;
        this.stripeApiVersion = process.env["STRIPE_API_VERSION"] as Stripe.LatestApiVersion;
        this.databaseEngine = process.env["DATABASE_ENGINE"]!;
        this.databasePassword = process.env["DATABASE_PASSWORD"]!;
        this.databaseUsername = process.env["DATABASE_USERNAME"]!;
        this.databaseName = process.env["DATABASE"]!;
        this.databaseHost = process.env["DATABASE_HOST"]!;
        this.databasePort = parseInt(process.env["DATABASE_PORT"]!);
        this.serverPort = parseInt(process.env["SERVER_PORT"]!);
        this.stripeCancelUrl = process.env["STRIPE_CANCEL_URL"]!;
        this.stripeSuccessUrl = process.env["STRIPE_SUCCESS_URL"]!;
        this.mailHostName = process.env["MAIL_HOST_NAME"]!;
        this.googleAppPassword = process.env["GOOGLE_APP_PASSWORD"]!;
        this.mailUsername = process.env["MAIL_USERNAME"]!;
        this.mailPort = parseInt(process.env["MAIL_POST"]!);
        this.jwtSecret = process.env["JWT_SECRET"]!;
        this.jwtExpiry = process.env["JWT_EXPIRY"]!;
    }
}