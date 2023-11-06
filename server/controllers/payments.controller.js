const stripe = require('stripe')(process.env.PAYMENT_API_KEY);
const db = require('../models');
const User = require('../models/user.model');

const packageToPriceMap = {
  Free: 'price_1O84GEDtchbgKw9RJbLm5f3j',
  Starter: 'price_1NP402DtchbgKw9Rp2ThXcZh',
  Standard: 'price_1NP41JDtchbgKw9RXRjncKgY',
  Premium: 'price_1NP41gDtchbgKw9RMFIE58uF',
};

exports.editSubscription = async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });

  console.log('editSubscription', req.body.packageId);
  const session = await stripe.billingPortal.sessions.create({
    customer: user.billingId,
    return_url: `${process.env.PAYMENT_UPDATED_URL}`,
  });

  return res.send(JSON.stringify(session.url));
};

exports.createSubscription = async (req, res) => {
  console.log('createSubscription', req.body.packageId);
  const packageId = req.body.packageId;
  const user = await User.findOne({ _id: req.body.userId });

  const priceId = packageToPriceMap[packageId];

  const session = await stripe.checkout.sessions.create({
    customer: user.billingId,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      priceId,
    },
    subscription_data: {
      trial_period_days: 7,
    },
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
  const data = event.data.object;

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('created', data);
      const user = await User.findOne({ billingId: data.customer });

      if (data.plan.id === packageToPriceMap.Starter) {
        user.package = 'Starter';
      }
      if (data.plan.id === packageToPriceMap.Standard) {
        user.package = 'Standard';
      }
      if (data.plan.id === packageToPriceMap.Premium) {
        user.package = 'Premium';
      }
      user.isTrail = true;
      user.paymentEndDate = new Date(data.current_period_end * 1000);
      await user.save();

      break;

    case 'checkout.session.completed':
      console.log('completed', data);

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
