const express = require('express');
const path = require('path');
const app = express();
const stripe = require('stripe')('sk_test_51PQ7oVP0QsaqRabXjCjMOf9EwJ5XDQpXlRrRHtLfJ1qPxx2HOpz7BdJZvAq24nnrKUckXTJmFHrk0xBfqIErHRJy0033JaQ0F4'); // Use your Stripe Secret Key
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());
const cors = require('cors');
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, userId } = req.body;  // Incluyendo userId
    console.log("Creating checkout session for items:", items);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.descripcion,
            images: [item.img],
          },
          unit_amount: item.precio * 100, // Stripe espera el monto en céntimos
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: 'http://localhost:5173/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: { userId, cart: JSON.stringify(items) }  // Incluyendo metadata
    });

    console.log("Checkout session created successfully:", session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/check-session', async (req, res) => {
  const { session_id } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      // Guardar el pedido en Firestore
      const orderData = {
        userId: session.metadata.userId,
        cart: JSON.parse(session.metadata.cart),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('orders').add(orderData);
      console.log("Order saved successfully:", orderData);
    }
    res.status(200).json(session);
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ error: error.message });
  }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
