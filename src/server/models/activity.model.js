const mongoose = require('mongoose');

const Activity = mongoose.model(
  'Activity',
  new mongoose.Schema({
    name: String,
    guid: String,
    createdBy: String,
    active: { type: Boolean, default: false },
    coverPhoto: String,
    images: [String],
    category: Number,
    description: String,
    street: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    email: String,
    facebook: String,
    instagram: String,
    phone: String,
    www: String,
  })
);

module.exports = Activity;
