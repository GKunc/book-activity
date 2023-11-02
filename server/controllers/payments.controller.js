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

  return res.send(JSON.stringify(session.url));
};

exports.listenForSubscriptionEvents = async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook Error', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('completed', event);
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer to your database.
      // save:
      // 1) customer
      // 2) when next payment
      break;
    case 'invoice.paid':
      console.log('paid', event);
      // save:
      // 1) customer
      // 2) when next payment
      // 3) update user to allow actions
      // =====
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break;
    case 'invoice.payment_failed':
      console.log('payment_failed', event);
      // save:
      // 1) customer not paid
      // 2) warning
      // =====
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break;
    default:
      // Unhandled event type
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};
