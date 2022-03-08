import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
const stripe = new Stripe('sk_test_51J0FbAHU5D5GXWiIvQerwuTlT5l1UYJrCSZ84wYJis4VrVHVZySBlEocCLQlWkymqNg5ij9J3siZrFUrczWVHFDh005wi7ATEq', {
  apiVersion: '2020-08-27',
});

const app = express();
app.use(cors({
    origin:['http://localhost:5000']
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
  
    res.json({ id: session.id });
  });
  

app.listen(4000, () => {
    console.log('The application is listening on port 4000!');
})

