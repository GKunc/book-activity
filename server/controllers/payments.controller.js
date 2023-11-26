const stripe = require('stripe')(process.env.PAYMENT_API_KEY);
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

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
    locale: 'pl',
  });

  return res.send(JSON.stringify(session.url));
};

exports.createSubscription = async (req, res) => {
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
    locale: 'pl',
  });

  return res.send(JSON.stringify(session.url));
};

exports.listenForSubscriptionEvents = async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook Error', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  const data = event.data.object;
  let user;

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('customer.subscription.created', data);
      user = await User.findOne({ billingId: data.customer });

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
      user.trailEnds = new Date(data.current_period_end * 1000);
      user.isConfirmed = true;
      await user.save();

      break;

    case 'customer.subscription.updated':
      user = await User.findOne({ billingId: data.customer });

      if (data.plan.id === packageToPriceMap.Starter) {
        user.package = 'Starter';
      }
      if (data.plan.id === packageToPriceMap.Standard) {
        user.package = 'Standard';
      }
      if (data.plan.id === packageToPriceMap.Premium) {
        user.package = 'Premium';
      }

      const isOnTrial = data.status === 'trialing';
      if (isOnTrial) {
        user.isTrail = true;
        user.trailEnds = new Date(data.current_period_end * 1000);
      } else if (data.status === 'active') {
        user.isTrail = false;
        user.endDate = new Date(data.current_period_end * 1000);
        user.trailEnds = null;
      }

      if (data.canceled_at) {
        user.package = 'Free';
        user.isTrail = false;
        user.paymentEndDate = null;
        user.trailEnds = null;
      }

      await user.save();
      break;

    case 'invoice.paid':
      console.log('invoice.paid', event);
      user = await User.findOne({ billingId: data.customer });
      const active = await Activity.updateMany({ createdBy: user._id }, { $set: { active: true } });
      console.log('UPDATED paid', active);

      break;
    case 'invoice.payment_failed':
      console.log('payment_failed', event);
      const user = await User.findOne({ billingId: data.customer });
      const act2 = await Activity.updateMany({ createdBy: user._id }, { $set: { active: true } });
      console.log('UPDATE payment_failed', act2);

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.send();
};
