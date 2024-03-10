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

     new User({
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

     new User({
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

     new User({
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

     new User({
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
  if (roles?.length === 0) {
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
  if (packages?.length === 0) {
     new Package({
      name: 'Free',
      priceId: 'price_1O84GEDtchbgKw9RJbLm5f3j',
    }).save();

     new Package({
      name: 'Starter',
      priceId: 'price_1NP402DtchbgKw9Rp2ThXcZh',
    }).save();

     new Package({
      name: 'Standard',
      priceId: 'price_1NP41JDtchbgKw9RXRjncKgY',
    }).save();

     new Package({
      name: 'Premium',
      priceId: 'price_1NP41gDtchbgKw9RMFIE58uF',
    }).save();
  }

  const categories = await Category.find({});
  console.log("CATEGORIES DEV", categories?.length)
  if (categories.length === 0) {
    await new Category({
      "id": 0,
      "name": "Koszykówka",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M15.5 4.4C9.5 7.2 6.8 10 4.1 16 .5 23.9 2.2 34.3 8.3 40.9 11.6 44.5 19.8 48 25 48s13.4-3.5 16.7-7.1c3.4-3.7 6.3-11 6.3-15.9 0-5.2-3.5-13.4-7.1-16.7C37.2 4.9 29.9 2 25 2c-2.7 0-6.5 1-9.5 2.4zM24 14v10h-3.4c-3 0-3.5-.4-4.1-3.1-.4-1.7-2.1-4.6-3.8-6.5-3-3.5-3-3.5-1-5.5C13.6 7 20.1 4.1 22.8 4c.9 0 1.2 2.6 1.2 10zm11.1-7.4c5 2.5 5.4 4 2.1 7.8-1.7 1.9-3.3 4.8-3.7 6.5-.6 2.7-1.1 3.1-4.1 3.1H26V3.8l3.3.7c1.7.4 4.4 1.3 5.8 2.1zm-22.4 11c3.4 5.8 3.1 6.4-3.3 6.4H3.8l.7-3.3c.9-4.2 3.3-7.9 4.8-7.4.7.2 2.2 2.1 3.4 4.3zm30.7-2.4c.8 1.3 1.7 3.8 2.1 5.5l.7 3.3h-5.7c-5.7 0-5.7 0-5-2.7.7-3.1 4.2-8.3 5.5-8.3.5 0 1.6 1 2.4 2.2zM15 27.2c0 1.9-4.3 9.1-5.7 9.5-1.5.5-3.9-3.2-4.8-7.5L3.8 26h5.6c3.8 0 5.6.4 5.6 1.2zm9 8.9v10.1l-3.2-.7c-4.1-.9-8.1-2.9-9.7-4.9-1.1-1.3-.9-2.1 1.7-5 1.7-1.9 3.3-4.8 3.7-6.5.6-2.7 1.1-3.1 4.1-3.1H24v10.1zm9.5-7c.4 1.7 2 4.6 3.7 6.5 2.6 2.9 2.8 3.7 1.7 5-1.6 2-5.6 4-9.6 4.9l-3.3.7V26h3.4c3 0 3.5.4 4.1 3.1zm12 .1c-.9 4.3-3.3 8-4.8 7.5-1.4-.4-5.7-7.6-5.7-9.5 0-.8 1.8-1.2 5.6-1.2h5.6l-.7 3.2z'/></svg>",
    }).save();

    await new Category({
      "id": 1,
      "name": "Pływanie",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M14.7 15.6c-7.3 3.8-8.9 5.7-6.4 8.1 1.4 1.4 2.1 1.4 7.2-.7 4.4-1.8 5.9-2 6.8-1.1 1.5 1.5-1.6 4.2-9.7 8.6-5 2.7-5.6 2.8-8.2 1.5L.8 30.2c-.5-.2-.8.1-.8.7 0 1.8 8 5.2 13.4 5.8 3.3.3 7.4-.1 11.6-1.2 11.5-3.1 13.3-3.1 23.3 1 .9.4 1.7.3 1.7-.2 0-1.3-6.4-4.2-11-4.9-2.2-.4-4-1.2-4-1.8 0-2-10.5-17.1-12-17.3-.8-.1-4.6 1.3-8.3 3.3zM28 21.3c2.5 3.9 4.5 7.8 4.5 8.6 0 1.8-11.3 5.1-17.3 5.1-5.5 0-4.9-.9 3.8-6.1l6.9-4.1-1.4-2.8c-.8-1.6-1.9-3.1-2.4-3.5-.5-.3-3.5.7-6.5 2.2-5.3 2.6-7.6 2.7-6.1.3.7-1.1 11.4-6.9 13-6.9.6-.1 3 3.2 5.5 7.2z'/><path d='M35.7 19.8c-3.3 3.6-.8 9.2 4 9.2 2.5 0 5.3-3 5.3-5.7 0-4.6-6.2-6.9-9.3-3.5zm6.7 2.4c.8 1.4.7 2.1-.6 3.4-3 3-7.5-.9-4.8-4.2 1.6-1.8 3.9-1.5 5.4.8z'/></svg>",  
    }).save();

    await new Category({
      "id": 2,
      "name": "Piłka nożna",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M15.5 4.4C9.5 7.2 6.8 10 4.1 16 .5 23.9 2.2 34.3 8.3 40.9 11.6 44.5 19.8 48 25 48s13.4-3.5 16.7-7.1c3.4-3.7 6.3-11 6.3-15.9 0-5.2-3.5-13.4-7.1-16.7C37.2 4.9 29.9 2 25 2c-2.7 0-6.5 1-9.5 2.4zm11.2 1.3c-1.6 1.6-1.8 1.6-3.4 0S21.8 4 25 4s3.3.1 1.7 1.7zm-5.6 1C23.3 8 24 9.2 24 11.6c0 2.6-.8 3.6-4.2 6-6 4-9.8 3.1-11.2-2.7-.6-2.6 2.2-6.1 6.9-8.7 2.6-1.4 2.2-1.5 5.6.5zm13.7-.3c1.5.8 3.7 2.5 4.9 3.8 2.9 3 1.9 7.7-2 9.6-2.3 1.1-3 .9-7.1-2-3.8-2.6-4.6-3.7-4.6-6.3 0-2.2.7-3.5 2.8-4.7 3.3-2.1 2.8-2.1 6-.4zM5.9 20.6c-1.7 2.1-2.1 1.1-.8-2.2 1-2.3 1.3-2.5 1.6-1.1.3 1-.1 2.5-.8 3.3zm39.3-1.1c.4 2 .3 2.3-.8 1.4-1.5-1.2-2-5.4-.5-4.5.5.3 1.1 1.7 1.3 3.1zm-15.3.4 3.4 2.8-1.5 4.4-1.5 4.4H19.7l-1.5-4.4-1.5-4.4 3.4-2.8c1.9-1.6 4.1-2.8 4.9-2.8s3 1.2 4.9 2.8zm-17.6 2c1.8.7 3 2.4 4.2 6 1.6 4.8 1.5 5.2-.2 7.6-1.2 1.7-2.4 2.3-3.8 2-1.1-.3-2.7-.5-3.6-.5-1.6 0-3.2-3-4.5-8.3-.5-2.1-.1-3.4 1.7-5.3 2.5-2.7 2.8-2.8 6.2-1.5zm31.6 1.5c4.1 4.3.8 12.8-5.4 14-2.4.5-3.4.1-4.8-1.9-1.7-2.4-1.8-2.8-.2-7.6 1.6-4.7 3.6-6.6 7.1-6.8.6-.1 2.1 1 3.3 2.3zm-11.7 13c1.4 2 1.5 2.9.5 5.5-1.3 3.5-5.2 4.8-11 3.7-4.4-.8-6.5-5.6-3.9-9.2 1.4-2 2.6-2.3 7.2-2.3s5.8.3 7.2 2.3zM14 40c.4 0 1 .9 1.3 2 .4 1.6.2 1.8-1.2 1-1-.5-2.4-1.7-3.2-2.6-1.2-1.6-1.2-1.7.4-1.1 1 .4 2.2.7 2.7.7zm25 .6c-.8.8-2.1 1.9-3.1 2.4-1.4.8-1.6.6-1.2-1 .3-1 1.5-2.1 2.7-2.3 1.1-.2 2.3-.5 2.5-.6.2 0-.2.6-.9 1.5z'/></svg>",  
    }).save();

     new Category({
      "id": 3,
      "name": "Gimnastyka",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='m34.5 6.5-7 4.4-11.1.1c-8.9 0-11.4.3-12.5 1.6-.9 1.1-1 2-.2 3.2.8 1.3 2.8 1.8 8.6 2l7.6.3.3 14.2.3 14.2H23c2.4 0 2.5-.2 2.8-7.7.2-4.5.8-8 1.5-8.6s4.5-2 8.6-3.1c7.8-2.2 10.1-3.5 10.1-5.8s-2.4-2.5-8.8-.9c-7.5 2-7.2 2-7.2-.7 0-1.7 1.9-3.3 7.5-6.9 8-5 9.5-6.9 7.5-9.3-1.8-2.2-2.8-1.9-10.5 3zM44 5.3c0 .6-3.6 3.5-8 6.2-8 5-8 5-8 9.2 0 2.4.1 4.3.3 4.3.1 0 3.4-.9 7.2-2 7.9-2.3 8.5-2.3 8.5-1.1 0 .5-3.4 1.8-7.6 2.9C24.5 28.1 24 28.6 24 37.5c0 4.3-.4 7.5-1 7.5s-1-5.5-1-14.5V16h-8.5C6.6 16 5 15.7 5 14.5S7 13 16.8 13l11.7-.1L35 8.5c6.8-4.5 9-5.4 9-3.2z'/><path d='M29.7 30.8c-3.3 3.6-.8 9.2 4 9.2 2.5 0 5.3-3 5.3-5.7 0-4.6-6.2-6.9-9.3-3.5zm6.7 2.4c.8 1.4.7 2.1-.6 3.4-3 3-7.5-.9-4.8-4.2 1.6-1.8 3.9-1.5 5.4.8z'/></svg>",
    }).save();

     new Category({
      "id": 4,
      "name": "Ogólnorozwojowe",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M24 8c0 2.2.5 4 1 4 .6 0 1-1.8 1-4s-.4-4-1-4c-.5 0-1 1.8-1 4zm-9-2.6c0 1.5 2.4 6.6 3.1 6.6 1.1 0 1.1 0-.2-3.9-.6-1.7-1.5-3.1-2-3.1s-.9.2-.9.4zm17.1 2.7c-1.3 3.9-1.3 3.9-.2 3.9.5 0 1.4-1.4 2-3.1C35.2 5 35.2 5 34.1 5c-.5 0-1.4 1.4-2 3.1z'/><path d='M6.3 12.8C6 13.9 5 15 3.9 15.3 2.2 15.8 2 16.8 2 24s.2 8.2 1.9 8.7C5 33 6 34.1 6.3 35.2c.4 1.4 1.2 1.9 2.9 1.6 2-.3 2.3-.9 2.6-5.1.2-2.6.7-4.7 1.3-4.7.5 0 .9.7.9 1.5 0 .9 1.1 2.7 2.5 4.1 2.3 2.3 2.4 3 1.9 7.9-.4 3.5-.3 5.5.3 5.5s1.4-2.7 1.7-6.1c.7-5.7.6-6.1-1.8-8-2.9-2.3-3.4-4.9-1.1-4.9 1.1 0 1.5-1.2 1.5-4.5 0-2.5.5-4.5 1-4.5.6 0 1 .4 1 1 0 .5.5 1 1 1 .6 0 1-.7 1-1.5s.5-1.5 1-1.5c.6 0 1 .7 1 1.5s.5 1.5 1 1.5c.6 0 1-.5 1-1 0-.6.5-1 1-1 .6 0 1 .7 1 1.5s.5 1.5 1 1.5c.6 0 1-.5 1-1 0-.6.5-1 1-1 1.7 0 1.2 11.1-.6 13.1-1.2 1.3-1.4 3-.8 7.8.3 3.4 1.1 6.1 1.7 6.1s.7-2.2.3-5.8c-.4-4.2-.2-6.2.9-7.6.8-1.1 1.5-2.8 1.5-3.8s.7-1.8 1.4-1.8c1.1 0 1.6 1.4 1.8 4.7.3 4.2.6 4.8 2.6 5.1 1.7.3 2.5-.2 2.9-1.6.3-1.1 1.3-2.2 2.4-2.5 1.7-.5 1.9-1.5 1.9-8.7s-.2-8.2-1.9-8.7c-1.1-.3-2.1-1.4-2.4-2.5-.4-1.4-1.2-1.9-2.9-1.6-2 .3-2.3.9-2.6 5-.2 3.3-.8 4.8-1.7 4.8-.7 0-1.5-.8-1.7-1.7-.4-2.1-9.6-4.3-14.1-3.4-2.3.5-3.3 1.3-3.5 2.9s-1 2.2-2.7 2.2c-2.1 0-2.4-.5-2.7-4.8-.3-4.1-.6-4.7-2.6-5-1.7-.3-2.5.2-2.9 1.6zM10 24c0 6.7-.4 11-1 11s-1-4.3-1-11 .4-11 1-11 1 4.3 1 11zm32 0c0 6.7-.4 11-1 11s-1-4.3-1-11 .4-11 1-11 1 4.3 1 11zM6 24c0 4-.4 7-1 7s-1-3-1-7 .4-7 1-7 1 3 1 7zm40 0c0 4-.4 7-1 7s-1-3-1-7 .4-7 1-7 1 3 1 7zm-29 0c0 .5-1.1 1-2.5 1s-2.5-.5-2.5-1c0-.6 1.1-1 2.5-1s2.5.4 2.5 1zm21 0c0 .5-.7 1-1.5 1s-1.5-.5-1.5-1c0-.6.7-1 1.5-1s1.5.4 1.5 1z'/></svg>",  
    }).save();

     new Category({
      "id": 5,
      "name": "Lekkoatletyka",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M26.7 6.8c-2.2 2.5-2.1 4.5.3 6.7 3 2.7 7.4 1 7.8-3 .6-4.9-4.8-7.3-8.1-3.7zm6.1 3c.4 2.8-2.4 4-4.5 1.9-1.4-1.3-1.4-1.9-.3-3.2 1.8-2.2 4.4-1.5 4.8 1.3zm-21.2 9.3c-2.1 2.2-3.6 4.8-3.4 5.7.5 2.8 3.7 2.5 6.9-.7 5-5 6.1-3.6 3.6 4.4-2.3 7.3-3.3 8.4-8.4 8.7-5.3.3-7.6 2.6-5.4 5.2C5.9 43.5 8 44 12 44c5.6 0 6-.2 9.4-4.1l3.5-4.2 7.3.7c11.5 1.2 12 1.2 13.2-.6 1.8-2.8-1.3-4.9-9.3-6.1-5.4-.9-7.1-1.5-7.1-2.8 0-2.6 1-2.9 4.5-1.2 3.1 1.5 3.5 1.5 6.7-.8 3.7-2.6 4.8-3.8 4.8-5.7 0-2.2-3-2.5-6.4-.7-3.2 1.8-3.3 1.7-7.8-.9-3.4-2-5.8-2.6-10-2.6-5.2 0-5.8.2-9.2 4.1zm15.9-.8c1.7 1.3 1.7 1.6.1 6.2-.9 2.7-1.6 5.2-1.6 5.7 0 .4 1.8.8 3.9.8 6.2 0 14.1 2.1 14.1 3.8 0 1.1-.7 1.3-2.7.8-1.6-.4-6.8-1-11.6-1.3-6.1-.4-9-1-9.4-1.9-.3-.7.3-3.6 1.2-6.5 1.5-4.3 1.5-5.3.4-6-2.4-1.5-4.2-1-7.6 2.3-4.4 4.3-5.6 2.7-1.3-1.7 2.9-3 4-3.5 8-3.5 2.5 0 5.4.6 6.5 1.3zM43 19.9c0 .5-1.6 1.9-3.5 3.1-3.3 2.1-3.7 2.1-6 .6-1.4-.9-2.5-2.1-2.5-2.7 0-.7 1-.4 2.5.5 2.4 1.6 2.7 1.6 5.2-.4 2.8-2.2 4.3-2.6 4.3-1.1zM21.4 35.8c.3.5-.6 2-2 3.5-2.1 2.3-3.3 2.7-7.9 2.7-4.2 0-5.5-.3-5.5-1.5 0-1.1 1.2-1.5 5-1.5 3.9 0 5.2-.4 6-2 1.1-2 3.5-2.7 4.4-1.2z'/></svg>"
    }).save();

     new Category({
      "id": 6,
      "name": "Boks",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M17.5 1.5c-4.8 1.7-6.1 3.4-7 8.6-.4 2.1-1.2 3.9-1.9 3.9C6.4 14 3 18.5 3 21.3c0 3.9 4.7 12.6 8.8 16.4 1.9 1.8 3.7 4.6 4.1 6.5.9 4.3 3.9 5.8 12.3 5.8 9.9 0 11.5-.9 12.3-6.7.3-2.6 1.3-7.2 2.1-10.2.9-2.9 1.8-9.4 2.1-14.5C45.4 3.7 42.2.1 28 .1c-3.6 0-8.3.6-10.5 1.4zM37 3.3c5.2 1.8 6.2 4.6 5.6 15.2-.5 9.6-1.7 14.9-4 18-1.2 1.6-2.9 2-11.2 2.3-11.7.4-14.6-.9-18.9-8.2-3.5-6-4.2-10.7-2-13 2.6-2.5 3.9-1.5 4.7 3.8.8 5.5 1.6 8.1 2.4 7.4.3-.3 0-4.4-.6-9-1.9-14.3.7-17.6 14.5-17.7 3.3 0 7.6.5 9.5 1.2zm1.7 39.4c-.4 2-1.2 4-1.9 4.5-2.1 1.3-15.2.9-17-.5-.8-.6-1.8-2.2-2.1-3.5-.5-2.1-.3-2.2 7.6-2.3 4.5-.1 9.3-.5 10.7-.9s2.7-.8 2.9-.9.1 1.6-.2 3.6z'/></svg>"
    }).save();

     new Category({
      "id": 7,
      "name": "Joga",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M20.1 5.7c-1.6 1.6-3.7 3.4-4.5 4.1-.9.7-1.6 2.2-1.6 3.4 0 1.7.4 1.9 2.8 1.4 3.4-.8 4-.8 7.4 0 1.9.4 3.2 0 4.7-1.5 2.6-2.6 2.7-5.5.1-8.1-2.7-2.7-5.4-2.5-8.9.7zm7.9.8c2.6 3.2-1.3 8.1-4.7 5.9C21 11 20.5 8.3 22 6.5c1.6-1.9 4.4-1.9 6 0zm-9 4.4c0 1.2-2 2.5-2.7 1.8s.6-2.7 1.8-2.7c.5 0 .9.4.9.9zm-2 6.9c-1.7.5-3.3 2.3-4.8 5.6-3.2 6.5-3.3 9.7-.5 11.1l2.2 1.1-2.9 2.6c-3.4 3-3.9 6.3-1.1 7.8 1.1.5 8 1 15.5 1 10.9 0 13.8-.3 15-1.6 2.4-2.3 2-4.2-1.6-7.5-2.2-2-2.7-2.9-1.6-2.9.8 0 2.1-.7 2.8-1.5 1-1.2.8-2.6-1-7.5-1.2-3.3-2.9-6.5-3.6-7.1-1.7-1.4-14.7-2.2-18.4-1.1zm15 2.1c1.8.5 3.1 2.2 4.9 6.4 1.3 3.1 2.1 6 1.8 6.3-.3.4-3.6-.1-7.2-1-6-1.5-7-1.5-13 0-3.6.9-6.9 1.4-7.2 1-.3-.3.5-3.2 1.8-6.3 2.7-6.3 4.1-7.1 11.9-7.1 2.5 0 5.6.3 7 .7zm3.2 17.4c7.1 6.2 6.4 7.1-6 7.5-8.2.2-10.2 0-10.2-1.1 0-1 2.1-1.8 6-2.6 3.3-.7 6-1.6 6-2.2 0-2.5-12.2 1-13.5 3.9-1.2 2.7-6.2 3.1-7.2.6-.6-1.7 7.3-9.3 11.1-10.6 4-1.3 8.8.3 13.8 4.5z'/><path d='M23 22.6c-.6 1.4-2.3 2.9-4 3.5-2.7 1-4.2 2.9-2.1 2.9 2.4 0 7.1-2.4 7.1-3.6 0-.8.5-1.4 1-1.4.6 0 1 .6 1 1.4 0 1.2 4.7 3.6 7.1 3.6 2.1 0 .6-1.9-2.1-2.9-1.7-.6-3.4-2.1-4-3.5-.5-1.5-1.4-2.6-2-2.6s-1.5 1.1-2 2.6z'/></svg>"
    }).save();

     new Category({
      "id": 8,
      "name": "Tenis",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32' height='32' viewBox='0 0 50 50'><path d='M30.3 1.4c-1.8.8-3.3 2-3.3 2.6 0 1.3 1 1.2 4-.5 5.2-3 11.5-1.3 15.1 4.1 3.7 5.6 1.4 13-6.1 19.8-8.3 7.5-15.2 8.6-20.6 3.2-2.8-2.8-3.4-4.2-3.4-7.5 0-3.7.2-4.1 2.6-4.1 3.7 0 8.4-5 8.4-9 0-4.3-4.7-9-9-9-2.2 0-4.1.9-6.1 2.9C8 7.8 8 12.2 11.8 16c2.7 2.7 2.8 3.1 2.1 9.1-.8 7.4-1.6 9.9-3.3 9.9-.6 0-3.3 2.2-5.9 4.8-5 5.1-5.4 7.2-1.5 9.3 1.7.9 2.7.4 6.9-3.7 2.7-2.7 4.9-5.4 4.9-6 0-1.6 5.4-3.4 10.5-3.4 5.7 0 13.6-4.2 18.5-9.7 7.2-8.2 7.8-16.2 1.6-22.2-4.1-3.9-10.2-5-15.3-2.7zm-7.6 3.8C25 7.3 25.8 10 24.2 10c-1 0-6.2-5.3-6.2-6.3 0-1.4 2.4-.6 4.7 1.5zm-3.1 3.4c4 4.1 4.4 4.8 3.1 6.1s-2 .9-6.1-3.2c-3.8-3.8-4.5-4.9-3.5-6.1.6-.8 1.3-1.4 1.5-1.4s2.4 2.1 5 4.6zm-4.4 4.1c3 2.9 3.5 4.3 1.6 4.3-1.6 0-5.8-4.1-5.8-5.7 0-1.9 1.1-1.6 4.2 1.4zm2.5 21.5c.9.2.4.7-1.5 1.4l-2.9 1.1 1.1-2.9c.7-1.9 1.2-2.4 1.4-1.5s1 1.7 1.9 1.9zm-6.1 4.9c.7 1.2-5.4 7.9-7.3 7.9-2.2 0-1.5-2.2 1.9-5.7s4.3-3.9 5.4-2.2z'/><path d='M31.8 5.7c-2.1.8-3.8 2-3.8 2.5 0 .6.8.7 1.8.3 5.6-2.3 7-2.5 9.5-1.6 3.6 1.4 5.1 5.4 3.7 9.6C41.3 21.8 31.2 30 26.5 30 24 30 20 25.4 20 22.5c0-1.5-.4-2.4-1-2-3.4 2.1 2.3 11.5 7 11.5 6 0 15.2-7 18.2-13.8 2.6-5.8 1.1-10.7-3.8-12.8-4-1.7-4-1.7-8.6.3z'/></svg>"
    }).save();

     new Category({
      "id": 9,
      "name": "Taniec",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M24.2 4.2c-1.6 1.6-1.5 4.4.3 6.2 1.4 1.3 1.3 1.6-.6 2.6s-2 1-1.4-.9c.9-2.9-1.1-6.1-3.8-6.1-5.3 0-6.7 6.4-1.8 8.3 2.6 1 2.8 1.2 1.3 2.3-1.4 1-1.4 1.6-.3 5.2l1.4 4.1-6.7 7.7c-6.7 7.9-7.5 9.8-4.4 11.8 1.3.8 2.1.6 3.5-.7 1.8-1.6 2-1.6 3.6.1 2.4 2.4 4.4.9 8.9-6.9 4-6.9 4.4-6.7 5 2.5.6 7.7 6.8 7.1 6.8-.6 0-2.9.6-4.5 2.1-5.7 2.2-1.7 2.2-1.8.4-7.2-1-3-2.1-5.8-2.6-6.4-1.5-1.5-1.1-2.2 2.1-3.5 3-1.2 3.1-1.5 2.8-6.9-.3-4.9-.6-5.6-2.5-5.9-1.5-.2-2.7.5-3.9 2.3l-1.7 2.6-1.3-3c-1.4-3.3-4.9-4.2-7.2-1.9zm5.6 3.1c.4 2-2.5 3.4-4 1.9s-.1-4.4 1.9-4c1 .2 1.9 1.1 2.1 2.1zm9.2-.5c0 1.3-6.3 6.9-9.7 8.6-3.8 1.9-4.5 5.5-1.3 6.3C33 23 26.9 32 21.1 32c-3.6 0-3.7-.3-1.2-3.9 1.7-2.3 1.8-2.9.5-5.1-.7-1.4-1.3-3.1-1.4-3.7 0-.7 3-2.8 6.8-4.7 3.7-1.9 7.8-4.6 9.1-6C37.3 6 39 5.3 39 6.8zm-18.2 3.5c.4 2-2.5 3.4-4 1.9s-.1-4.4 1.9-4c1 .2 1.9 1.1 2.1 2.1zM39 12.9c0 1.1-.8 2.2-1.9 2.6-1 .3-2.9 1.4-4.1 2.5-1.3 1.1-2.9 2-3.7 2-2.5 0-1.3-2 2.5-3.9 2.1-1.1 4.4-2.7 5.1-3.5 1.7-2.1 2.1-2 2.1.3zm-3.5 11.4c2.4 5.9 2.9 8.7 1.3 8.7-1.3 0-4.8-7.9-4.8-10.8 0-2.4 2.1-1.1 3.5 2.1zm-2.7 7.6c1.7 5.6 1.6 12.1-.3 12.1-1 0-1.5-1-1.5-3.4 0-1.8-.3-5.4-.6-8-.8-5.7.8-6.2 2.4-.7zM18 34.2c-.1 1.7-7.5 9.8-8.9 9.8-1.9 0-1.2-1.5 2.7-6.4 3.6-4.5 6.2-5.9 6.2-3.4zm3.3 4.8c-2.6 4.7-5.3 6.6-5.3 3.7 0-2.1 5-8.7 6.6-8.7 1.2 0 .9 1.1-1.3 5z'/></svg>",
    }).save();

     new Category({
      "id": 10,
      "name": "Balet",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M30.5 2.5c-3.1 3-3.2 6.3-.4 11.8 2.1 3.9 2.1 4.6.9 12-2 12.3.1 19.7 5.7 19.7C46.1 46 52 32.6 49 17.8 46.1 2.9 37.3-4.4 30.5 2.5zm5.4 1.3c-.9 1.4-.9 3.5-.1 7.8.7 4.2.7 7.3-.1 10.7-1.8 8 2.6 12.7 9 9.8 2.5-1.2 2.6-1.1 1.9 1.9-.8 4.4-4.3 8.9-7.3 9.6-6.2 1.6-8.3-4.2-6.3-17 1.2-8 1.2-8.6-.9-12.5C29.5 8.9 29.4 6.6 32 4c2.7-2.7 5.5-2.8 3.9-.2zm6.4 2c.9 1 2.3 3.6 3.1 5.8 1.2 3.4 1.2 4.4 0 6.7-.8 1.5-1.9 2.7-2.4 2.7-2.6 0-7.2-13.2-5.5-16 .9-1.5 3-1.2 4.8.8zm-1.4 15.5c.8 1 .7 1.7-.1 2.5-2 2-3.6 1.4-3-1.3.5-2.8 1.4-3.1 3.1-1.2zm6.8 2.4c-.3.3-1.1.2-1.7-.2-.8-.5-.7-1.1.2-2.2 1.2-1.5 1.3-1.4 1.6.1.2 1 .1 2-.1 2.3zm-.7 3c0 .4-.7 1.5-1.7 2.5-1.9 2.1-5.6 2.4-7.2.4-1.6-1.9 4.6-5.7 7.2-4.4.9.5 1.7 1.2 1.7 1.5zM8.6 6.1c-10.6 8.4-11.1 37-.7 42.3 9.4 4.9 13.7-2.1 11.1-18.1-1.2-7.4-1.2-8.1.9-12 2.8-5.5 2.7-8.8-.4-11.8-3-3.1-7.3-3.2-10.9-.4zM18 8c2.6 2.6 2.5 4.9-.1 10.1-2.1 3.9-2.1 4.5-.9 12.5 2 12.8-.1 18.6-6.3 17-3-.7-6.5-5.2-7.3-9.6-.7-3-.6-3.1 1.9-1.9 1.4.6 3.7.9 5.2.5 3.7-.9 4.9-4.3 3.7-10.2-.7-3.3-.7-6.6 0-10.7.8-4.4.8-6.5-.1-7.9-1.6-2.6 1.2-2.5 3.9.2zm-5.8 5.4C12 18.1 8.8 25 7 25c-.5 0-1.6-1.2-2.4-2.7-1.2-2.3-1.2-3.3 0-6.7 1.8-4.9 4.3-7.8 6.3-7.3 1.2.2 1.5 1.4 1.3 5.1zM4.4 27.1c-1 1.6-2.4.9-2.4-1.2 0-1.8.2-1.9 1.5-.9.8.7 1.2 1.6.9 2.1zm7.8-.6c.6 2.7-1.2 3.4-3.1 1.2-.8-1-.7-1.7.1-2.5 1.8-1.8 2.5-1.5 3 1.3zm-.8 7.2c-2.6 1.9-4.8 1.6-7-.8-1.8-2-1.8-2.1-.1-3.4 1.6-1.1 2.4-1 5.4.8 3.3 1.9 3.4 2.1 1.7 3.4z'/></svg>"
    }).save();

     new Category({
      "id": 11,
      "name": "Wspinaczka",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M8 24c0 20.3-.1 21-2 21-1.1 0-2 .4-2 1s7.7 1 21 1 21-.4 21-1-.9-1-2-1c-1.9 0-2-.7-2-21V3H8v21zm32 1v20H10V5h30v20z'/><path d='M13 9c0 .5 1.4 1 3 1 1.7 0 3-.5 3-1 0-.6-1.3-1-3-1-1.6 0-3 .4-3 1zm15.9.6c-1.7 2.1 0 4.9 3.1 4.9s4.8-2.8 3.1-4.9C34.3 8.7 33 8 32 8s-2.3.7-3.1 1.6zm4.6 1.3c.7 1.2-1.2 2.4-2.5 1.6-1.1-.7-.4-2.5 1-2.5.5 0 1.1.4 1.5.9zm-19.6 5.7c-1.7 2.1 0 4.9 3.1 4.9s4.8-2.8 3.1-4.9C19.3 15.7 18 15 17 15s-2.3.7-3.1 1.6zm4.6 1.3c.7 1.2-1.2 2.4-2.5 1.6-1.1-.7-.4-2.5 1-2.5.5 0 1.1.4 1.5.9zM28 22c0 .5 1.1 1 2.5 1s2.5-.5 2.5-1c0-.6-1.1-1-2.5-1s-2.5.4-2.5 1zm-10 8c0 .5 1.4 1 3 1 1.7 0 3-.5 3-1 0-.6-1.3-1-3-1-1.6 0-3 .4-3 1zm10.9.6c-1.7 2.1 0 4.9 3.1 4.9s4.8-2.8 3.1-4.9C34.3 29.7 33 29 32 29s-2.3.7-3.1 1.6zm4.6 1.3c.7 1.2-1.2 2.4-2.5 1.6-1.1-.7-.4-2.5 1-2.5.5 0 1.1.4 1.5.9zM14 38c0 .5 1.1 1 2.5 1s2.5-.5 2.5-1c0-.6-1.1-1-2.5-1s-2.5.4-2.5 1zm17 3c0 .5 1.4 1 3 1 1.7 0 3-.5 3-1 0-.6-1.3-1-3-1-1.6 0-3 .4-3 1z'/></svg>"
    }).save();

     new Category({
      "id": 12,
      "name": "Badminton",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M9.2 5.1C6.3 6.6 3.4 8 2.8 8.2c-3.1 1.1 5 10.9 8.8 10.8.5 0 2.4-3.2 4.2-7.1 2.6-5.6 3.1-7.3 2.1-8.5-1.5-1.8-2.4-1.7-8.7 1.7zM17 5c0 .5-.2 1-.4 1-.3 0-.8-.5-1.1-1-.3-.6-.1-1 .4-1 .6 0 1.1.4 1.1 1zm-2.5 2c1.1 1.7-.5 3.2-2.1 1.9-.7-.6-1.1-1.5-.8-2 .7-1.2 2.1-1.1 2.9.1zm-3.6 3.3c3.9 4.2.4 7.7-3.9 4-3-2.6-2.5-5.7 1.1-6.2.3-.1 1.5 1 2.8 2.2zm18.9-5.8C24.2 8.3 22 12.7 22 19.9c0 5.8-.2 6.4-4.2 10.7-2.3 2.5-5.6 5.1-7.2 5.8-4.2 1.8-9 7.1-8.3 9.1.4.8 1.4 1.8 2.2 2.2 2 .7 7.3-4.1 9.1-8.3.7-1.6 3.3-4.9 5.8-7.2 4.2-3.9 5-4.2 10.2-4.2 6.7 0 11.6-2.1 15-6.5 5-6.5 3.8-14.7-2.6-18-4.2-2.2-8-1.9-12.2 1zM43 7.1c2.9 3 3.3 6.1 1.3 10.9-1.4 3.4-4.9 6.4-5.8 5.1-.9-1.5.4-3.3 2.1-2.7.8.3 1.1 0 .7-.9-.3-.8.2-1.7 1-2.1 2.2-.8 2.9-3.2.9-3-.9 0-1.7-.6-1.7-1.4s.8-1.4 1.8-1.4c2.3.2 2.2.1-1.4-3.5s-3.7-3.7-3.5-1.4c0 1-.6 1.8-1.4 1.8s-1.4-.8-1.4-1.7c.2-2-2.2-1.3-3 .9-.4.8-1.3 1.3-2.1 1-.9-.4-1.2-.1-.9.7.7 1.7-1.4 3.2-2.7 1.9-.6-.6-.2-1.6 1.1-2.8 5.5-5 10.9-5.5 15-1.4zm-7.4 2c1 1.7-1.3 3.6-2.7 2.2C31.7 10.1 32.5 8 34 8c.5 0 1.2.5 1.6 1.1zm6 0c1 1.7-1.3 3.6-2.7 2.2C37.7 10.1 38.5 8 40 8c.5 0 1.2.5 1.6 1.1zm-9 3c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm6 0c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm-11.8 1.1c-.2.6-1 1.4-1.6 1.6-.7.2-1-.2-.6-1.2.7-1.8 2.8-2.2 2.2-.4zm2.8 1.9c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm6 0c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm6 0c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm-15.1 3.7c0 1.8-2 1.5-2.3-.4-.3-1 .1-1.5 1-1.2.7.3 1.3 1 1.3 1.6zm6.1-.7c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm6 0c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm-9 3c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm6 0c1 1.7-1.3 3.6-2.7 2.2-1.2-1.2-.4-3.3 1.1-3.3.5 0 1.2.5 1.6 1.1zm-3.1 3c1 1.5-.1 2.3-2 1.5-.9-.3-1.3-1-1-1.6.8-1.3 2.2-1.3 3 .1zm5.5-.2c0 .5-.7 1.1-1.5 1.5-1.5.5-2-.5-.8-1.7.9-1 2.3-.9 2.3.2zM25.5 25c.3.5.1 1-.4 1-.6 0-1.1-.5-1.1-1 0-.6.2-1 .4-1 .3 0 .8.4 1.1 1zM12 38.8c0 1.4-6.6 7.3-7.3 6.5-.4-.4.7-2.2 2.5-4 3.1-3.2 4.8-4.1 4.8-2.5z'/></svg>"
    }).save();

     new Category({
      "id": 13,
      "name": "Ping Pong",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M2 2C.9 3.1 0 4.9 0 6c0 2.6 3.4 6 6 6 1.1 0 2.9-.9 4-2s2-2.9 2-4c0-2.6-3.4-6-6-6-1.1 0-2.9.9-4 2zm7 1.5c1.5 1.8 1 4.5-1.2 5.9C4.3 11.6.4 6.7 3 3.5c1.6-1.9 4.4-1.9 6 0zm14.5.3c-9.5 4.6-14 13.4-12.2 24l1 5.5-5.2 4.5c-2.8 2.4-5.1 5-5.1 5.7C2 45.6 6 50 8 50c1 0 3.8-2.3 6.2-5.1l4.5-5.2 5.5 1C32 42 38 40.3 43.1 35.4c5-4.8 7.3-10.9 6.6-17-.5-5.2-2.6-8.3-8-12.8C36.9 1.8 29.4 1 23.5 3.8zm13.8 1.6C41.5 7.1 46.6 13 47.5 17c1.5 7-2.9 16.2-9.5 19.9-6.2 3.5-7.7 2.9-16.9-6.3-8-8.1-8.4-8.6-7.8-12 .8-5.2 4-9.1 9.9-12 5.8-2.9 9.4-3.2 14.1-1.2zm-17.4 27 6.4 6.4-4-.5c-4.4-.6-4.9-.2-10.6 6.7-2.3 2.6-3.2 3.2-4.5 2.4-3.7-2.4-3.7-4.1-.2-7.1 6.9-5.7 7.3-6.2 6.6-10.4-.3-2.1-.5-3.9-.3-3.9.1 0 3.1 2.9 6.6 6.4z'/></svg>"
    }).save();

     new Category({
      "id": 14,
      "name": "Kolarstwo",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M33.7 5.8c-3.3 3.6-.8 9.2 4 9.2 2.5 0 5.3-3 5.3-5.7 0-4.6-6.2-6.9-9.3-3.5zm6.7 2.4c.8 1.4.7 2.1-.6 3.4-3 3-7.5-.9-4.8-4.2 1.6-1.8 3.9-1.5 5.4.8z'/><path d='M19.9 14.2c-8.6 7.1-8.8 8.8-1.9 13.5l4.1 2.8-.6 5.6c-.4 4.4-.2 5.9 1.1 6.9 1.1 1 2 1.1 3.2.4 1.7-1.1 2.5-3.4 3.6-10.6.6-4.2.4-4.9-2.1-7.3-2.7-2.5-2.8-2.6-.8-4.1 1.7-1.3 2.1-1.2 4.3 1.1 2.1 2.3 3 2.6 8 2.3 5.3-.3 5.7-.5 5.7-2.8 0-2.2-.5-2.6-4.7-3-4-.4-5.2-1.1-7.3-3.9-4.6-6.4-5.8-6.5-12.6-.9zm11.2 2.3c3 4.1 3.6 4.5 7.6 4.5 2.4 0 4.3.4 4.3 1 0 .5-2.1 1-4.7 1-3.9 0-5.1-.5-7.2-3l-2.6-3-3.5 3-3.5 3 3.3 2.9 3.3 2.8-1.2 6.7c-.7 4.4-1.6 6.6-2.5 6.6-1.6 0-1.7-1.6-.5-7.7l.8-4.3-4.8-3.1C17.2 25.2 15 23 15 22.1c0-1.7 9.6-10 11.7-10.1.6 0 2.6 2 4.4 4.5z'/><path d='M4.9 30.9c-2 2-2.9 3.9-2.9 6.1 0 4.3 4.7 9 9 9s9-4.7 9-9-4.7-9-9-9c-2.2 0-4.1.9-6.1 2.9zm10.8 1.3c2.9 2.7 2.9 6.5.1 9.5-2.7 2.9-6.5 2.9-9.5.1-2.9-2.7-2.9-6.5-.1-9.5 2.7-2.9 6.5-2.9 9.5-.1zm17.2-1.3c-2 2-2.9 3.9-2.9 6.1 0 4.3 4.7 9 9 9s9-4.7 9-9-4.7-9-9-9c-2.2 0-4.1.9-6.1 2.9zm10.8 1.3c2.9 2.7 2.9 6.5.1 9.5-2.7 2.9-6.5 2.9-9.5.1-2.9-2.7-2.9-6.5-.1-9.5 2.7-2.9 6.5-2.9 9.5-.1z'/></svg>"
    }).save();

     new Category({
      "id": 15,
      "name": "Nordic Walking",
      "iconSvg": "<svg xmlns='http://www.w3.org/2000/svg' version='1.0' width='32px' height='32px' viewBox='0 0 50 50'><path d='M25.6 3.6c-3.1 3-.9 8.4 3.4 8.4 2.4 0 5-2.6 5-5s-2.6-5-5-5c-1 0-2.6.7-3.4 1.6zM31.5 7c0 1.8-.6 2.6-2.3 2.8-1.3.2-2.5-.3-2.8-1.2-1-2.6.4-4.8 2.8-4.4 1.7.2 2.3 1 2.3 2.8z'/><path d='M19.6 16c-3.9 3-7.9 10-7.4 12.9.2.9-1.6 5.3-4 9.8C3.8 47.2 3.5 48 4.8 48c.5 0 2.9-3.8 5.3-8.5s5-8.5 5.7-8.5 1.9-1.8 2.8-4c.9-2.3 1.8-3.9 2-3.7 1.2 1.2-2.6 13.9-5 16.8-3 3.5-3 5.6-.3 7.3 1.6.9 2.5.4 5.8-3.4 2.1-2.5 3.9-5.1 3.9-5.8 0-2.9 2-.8 3.2 3.4 1.6 5.7 4 7.6 6.4 5.2 1.5-1.4 1.5-2.3.5-6.5-.7-2.6-2.3-6.4-3.7-8.4-1.4-2.1-2.2-4.3-1.8-5.2.7-1.8 2-2.2 2.8-.8.3.4 1.9 1.1 3.6 1.4l3 .6V38c0 6 .4 10 1 10s1.1-4.3 1.2-10.5c.1-5.8.2-11.3.2-12.3.1-1-1.3-2.4-3.3-3.4-1.8-.9-4-2.7-4.8-4-3.8-5.7-7.8-6.2-13.7-1.8zm10 .4c.3.7-.2 3.9-1.1 7-1.7 5.7-1.7 5.7.8 8.9 2.4 3.3 5.3 12.5 4.2 13.6-1 1-3.5-3.1-3.5-5.7 0-1.6-1.5-3.9-4.1-6.4l-4.1-3.9 1.2-5c.7-2.8.9-5.3.6-5.6-.9-1-5.3 3.5-6.6 6.8-1.4 3.4-3.5 3.9-2.4.6 1.3-4.3 2.9-6.6 6.4-9.2 3.7-2.7 7.8-3.3 8.6-1.1zm3.7 5c.3.8 1.9 1.7 3.6 2.1 2.9.6 4.4 2.5 2.1 2.5-2.6 0-8-3-8-4.4 0-2 1.6-2.1 2.3-.2zm-10 14.5C22.9 38.8 18 46 16.4 46c-2.2 0-1.6-2.2 1.6-6 1.7-1.9 3-4.3 3-5.3 0-1.1.5-1.7 1.3-1.4.6.2 1.1 1.4 1 2.6z'/></svg>"
    }).save();
  }
}

module.exports = initializeDevDb;
