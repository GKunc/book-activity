const User = require('../models/user.model');
const Role = require('../models/role.model');
const Package = require('../models/package.model');
const Category = require('../models/category.model');

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

  const roles = await Role.find({});
  if (roles && roles.length === 0) {
    new Role({
      name: 'user',
    }).save();

    new Role({
      name: 'moderator',
    }).save();

    new Role({
      name: 'admin',
    }).save();
  }

  const packages = await Package.find({});
  if (packages && packages.length === 0) {
    await new Package({
      name: 'Free',
      priceId: 'price_1O84GEDtchbgKw9RJbLm5f3j',
    }).save();

    await new Package({
      name: 'Starter',
      priceId: 'price_1NP402DtchbgKw9Rp2ThXcZh',
    }).save();

    await new Package({
      name: 'Standard',
      priceId: 'price_1NP41JDtchbgKw9RXRjncKgY',
    }).save();

    await new Package({
      name: 'Premium',
      priceId: 'price_1NP41gDtchbgKw9RMFIE58uF',
    }).save();
  }

  const categories = await Category.find({});
  if (categories && categories.length === 0) {
    await new Category({
      id: 0,
      name: 'Lekkoatletyka',
    }).save();

    await new Category({
      id: 1,
      name: 'Pływanie',
    }).save();

    await new Category({
      id: 2,
      name: 'Piłka nożna',
    }).save();

    await new Category({
      id: 3,
      name: 'Gimnastyka',
    }).save();

    await new Category({
      id: 4,
      name: 'Zajęcia ogólnorozwojowe',
    }).save();
  }
}

module.exports = initializeDevDb;
