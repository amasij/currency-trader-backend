import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import crypto from 'crypto';
import {from, Observable, of} from "rxjs";
import Axios, {AxiosObservable} from 'axios-observable';
import dotenv from 'dotenv';

dotenv.config();


const stripe = new Stripe('sk_test_51J0FbAHU5D5GXWiIvQerwuTlT5l1UYJrCSZ84wYJis4VrVHVZySBlEocCLQlWkymqNg5ij9J3siZrFUrczWVHFDh005wi7ATEq', {
    apiVersion: '2020-08-27',
});
const secret = process.env.SECRET_KEY;


const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5200']
}));
// app.use(express.static(__dirname + '/public'));

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
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
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
    });
    res.json({id: session.id});
});

app.post("/paystack-webhook", function (req, res) {

    console.log(req.body);
    const hash = crypto.createHmac('sha512', secret || '')
        .update(JSON.stringify(req.body))
        .digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        console.log(req.body)
        const event = req.body;
        // Do something with event
    }
    res.sendStatus(200);
});

app.get("/paystack-verify/:reference", (req, res) => {
    const reference: string = req.params.reference;
    if (!reference) {
        res.sendStatus(400).json({
            "message": "Reference is required"
        });
    }
    PayStackApiClient.verifyTransaction(reference).subscribe((v) => {
        res.status(200).json(v.data);
    }, e => {
        res.status(400).json(e.response.data);
    });
});

app.listen(4000, () => {
    console.log('The application is listening on port 4000!');
});

class PayStackApiClient {
    static verifyTransaction(reference: string): AxiosObservable<any> {
        return Axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${secret}`
            }
        });
    }
}