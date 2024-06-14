import * as functions from 'firebase-functions';
import corsPackage from 'cors';
const cors = corsPackage({origin: true});
import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === 'POST') {
      const { cart } = req.body;

      const line_items = cart.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.descripcion,
            images: [item.img],
          },
          unit_amount: item.precio * 100,
        },
        quantity: 1,
      }));

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: `${process.env.VITE_BASE_URL}/success`,
          cancel_url: `${process.env.VITE_BASE_URL}/cancel`,
        });

        res.status(200).json({ id: session.id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).send('Method Not Allowed');
    }
  });
});

export { createCheckoutSession };