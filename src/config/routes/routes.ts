import express from "express";
import {UserController} from "../../controllers/user.controller";
import {RouteConfiguration} from "./route-config";
import {PaystackController} from "../../controllers/payments/paystack.controller";
import {StripeController} from "../../controllers/payments/stripe.controller";

export class Routes {
    static register(app: express.Application) {
        (new UserController(app, '/users').register());
        (new PaystackController(app, '/paystack').register());
        (new StripeController(app, '/stripe').register())
    }
}