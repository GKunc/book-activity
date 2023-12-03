const User = require('../models/user.model');
const Package = require('../models/package.model');
const Activity = require('../models/activity.model');

const stripe = require('stripe')(process.env.PAYMENT_API_KEY);

async function editSubscription(userId) {
  const user = await User.findOne({ _id: userId });
  return stripe.billingPortal.sessions.create({
    customer: user.billingId,
    return_url: `${process.env.PAYMENT_UPDATED_URL}`,
    locale: 'pl',
  });
}

async function createSubscription(userId, packageId) {
  const user = await User.findOne({ _id: userId });
  const package = await Package.findOne({ name: packageId });
  console.log('package', package);
  return stripe.checkout.sessions.create({
    customer: user.billingId,
    mode: 'subscription',
    line_items: [
      {
        price: package.priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: `${process.env.PAYMENT_CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PAYMENT_CANCELLED}`,
    locale: 'pl',
  });
}

async function paymentsWebhook(body, headers) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, headers['stripe-signature'], process.env.WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook Error', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  const data = event.data.object;

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('customer.subscription.created');
      let user2 = await User.findOne({ billingId: data.customer });

      const package = await Package.find({ priceId: data.plan.id });

      user2.package = package.name;
      user2.isTrail = true;
      user2.paymentEndDate = new Date(data.current_period_end * 1000);
      user2.trailEnds = new Date(data.current_period_end * 1000);
      user2.isConfirmed = true;
      await user2.save();

      break;

    case 'customer.subscription.updated':
      let user = await User.findOne({ billingId: data.customer });
      const currentPackage = await Package.findOne({ priceId: data.plan.id });

      user.package = currentPackage.name;
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
      console.log('invoice.paid', data);
      // update paidTo
      let user1 = await User.findOne({ billingId: data.customer });
      await Activity.updateMany({ createdBy: user1._id }, { $set: { active: true } });
      break;

    case 'invoice.payment_failed':
      console.log('payment_failed');
      const user3 = await User.findOne({ billingId: data.customer });
      await Activity.updateMany({ createdBy: user3._id }, { $set: { active: true } });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

const PaymentsService = {
  createSubscription,
  editSubscription,
  paymentsWebhook,
};

module.exports = PaymentsService;
