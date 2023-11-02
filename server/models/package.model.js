const mongoose = require('mongoose');

const Package = mongoose.model(
  'Package',
  new mongoose.Schema({
    id: Number,
    name: String,
    priceId: String,
  })
);

module.exports = Package;
