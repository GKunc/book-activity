const mongoose = require('mongoose');

const Package = mongoose.model(
  'Package',
  new mongoose.Schema({
    name: String,
    priceId: String,
  })
);

module.exports = Package;
