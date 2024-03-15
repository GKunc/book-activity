const mongoose = require('mongoose');

const Group = mongoose.model(
  'Group',
  new mongoose.Schema({
    addressId: String,
    activityId: String,
    name: String,
    duration: Number,
    category: Number,
    price: Number,
    time: String,
    weekDay: Number,
    paymentPeriod: Number,
    limit: Number,
    reccuring: Boolean,
  })
);

module.exports = Group;
