import express from "express";
import {UserController} from "../../controllers/user/user.controller";
import {PaystackController} from "../../controllers/payments/paystack.controller";
import {StripeController} from "../../controllers/payments/stripe.controller";
import {WalletController} from "../../controllers/payments/wallet.controller";
import {OrderController} from "../../controllers/orders/order.controller";

export class Routes {
    static register(app: express.Application) {
        (new UserController(app, '/users').register());
        (new PaystackController(app, '/paystack').register());
        (new StripeController(app, '/stripe').register());
        (new WalletController(app, '/wallet').register());
        (new OrderController(app, '/orders').register());
    }
}