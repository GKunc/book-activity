const stripe = require('stripe')(process.env.PAYMENT_API_KEY);
const db = require('../models');
const Package = db.package;

exports.createSubscription = async (req, res) => {
  const packageId = req.body.packageId;
  const package = await Package.findOne({ id: packageId });

  console.log('createSubscription', package.priceId);
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: package.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.PAYMENT_CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PAYMENT_CANCELLED}`,
  });

  console.log(session);
  return res.send(JSON.stringify(session.url));
};

exports.listenForSubscriptionEvents = async (req, res) => {
  console.log('listenForSubscriptionEvents');
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
};
