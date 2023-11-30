const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.PAYMENT_API_KEY);

async function initializeDevDb() {
  const password = bcrypt.hashSync('Test1234!', 8);
  const userRole = await Role.find({ name: 'user' })._id;

  const freeUser = await User.find({ username: 'free' });
  if (freeUser && freeUser.length === 0) {
    const freeUserInfo = {
      username: 'free',
      email: 'free@gmail.com',
    };

    freeCustomerStripe = await stripe.customers.create({
      email: freeUserInfo.email,
      description: freeUserInfo.username,
    });

    await new User({
      username: freeUserInfo.username,
      email: freeUserInfo.email,
      password,
      guid: '8891c4e8-ce2d-4b72-9fa3-df0c182e2a4d',
      isConfirmed: true,
      createdAt: new Date(2023, 10, 10),

      billingId: freeCustomerStripe.id,
      paymentEndDate: new Date(2025, 02, 02),
      isTrail: false,
      trailEnds: null,
      package: 'Free',
      roles: [userRole],
    }).save();
  }

  const starterUser = await User.find({ username: 'starter' });
  if (starterUser && starterUser.length === 0) {
    const starterUserInfo = {
      username: 'starter',
      email: 'starter@gmail.com',
    };

    starterCustomerStripe = await stripe.customers.create({
      email: starterUserInfo.email,
      description: starterUserInfo.username,
    });

    await new User({
      username: starterUserInfo.username,
      email: starterUserInfo.email,
      password,
      guid: 'd403ee92-b535-45eb-ad04-d4fe9390b313',
      isConfirmed: true,
      createdAt: new Date(2023, 11, 11),

      billingId: starterCustomerStripe.id,
      paymentEndDate: new Date(2025, 02, 02),
      isTrail: false,
      trailEnds: null,
      package: 'Starter',
      roles: [userRole],
    }).save();
  }

  const standardUser = await User.find({ username: 'standard' });
  if (standardUser && standardUser.length === 0) {
    const standardUserInfo = {
      username: 'standard',
      email: 'standard@gmail.com',
    };

    standardCustomerStripe = await stripe.customers.create({
      email: standardUserInfo.email,
      description: standardUserInfo.username,
    });

    await new User({
      username: standardUserInfo.username,
      email: standardUser.email,
      password,
      guid: '38c21ab6-1b46-4ff0-9bdc-3e0f283567c2',
      isConfirmed: true,
      createdAt: new Date(2023, 12, 12),

      billingId: standardCustomerStripe.id,
      paymentEndDate: new Date(2025, 02, 02),
      isTrail: false,
      trailEnds: null,
      package: 'Standard',
      roles: [userRole],
    }).save();
  }

  const premiumUser = await User.find({ username: 'premium' });
  if (premiumUser && premiumUser.length === 0) {
    const premiumUserInfo = {
      username: 'premium',
      email: 'premium@gmail.com',
    };

    premiumCustomerStripe = await stripe.customers.create({
      email: premiumUserInfo.email,
      description: premiumUserInfo.username,
    });

    await new User({
      username: premiumUserInfo.username,
      email: premiumUserInfo.email,
      password,
      guid: 'a42cdb74-0645-46ec-b9bc-8f2c71768546',
      isConfirmed: true,
      createdAt: new Date(2024, 01, 22),

      billingId: premiumCustomerStripe?.id,
      isTrail: false,
      paymentEndDate: new Date(2025, 02, 02),
      trailEnds: null,
      package: 'Premium',
      roles: [userRole],
    }).save();
  }
}

module.exports = initializeDevDb;
