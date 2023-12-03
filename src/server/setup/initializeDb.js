const db = require('../models');

const Role = db.role;
const Package = db.package;

async function initializeDb() {
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
    new Package({
      id: 0,
      name: 'Free',
      priceId: 'price_1O84GJDtchbgKw9Rs0kHI7aI',
    }).save();

    new Package({
      id: 1,
      name: 'Starter',
      priceId: 'price_1OIwm2DtchbgKw9RoKsBeVcC',
    }).save();

    new Package({
      id: 2,
      name: 'Standard',
      priceId: 'price_1OIwlwDtchbgKw9RhRXFBYNa',
    }).save();

    new Package({
      id: 3,
      name: 'Premium',
      priceId: 'price_1OIwloDtchbgKw9RNwv0E1nx',
    }).save();
  }
}

module.exports = initializeDb;
