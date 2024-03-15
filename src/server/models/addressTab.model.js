const mongoose = require('mongoose');

const AddressTab = mongoose.model(
  'AddressTab',
  new mongoose.Schema({
    activityId: String,
    addressId: String,
    address: String,
  })
);

module.exports = AddressTab;
