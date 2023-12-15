const mongoose = require('mongoose');

const Settings = mongoose.model(
  'Settings',
  new mongoose.Schema({
    userId: String,
    phrase: String,
    weekDays: [Number],
    categories: [Number],
    minPrice: Number,
    maxPrice: Number,
    page: Number,
    limit: Number,
    viewType: Number,
    maxDistance: Number,
    coordinates: { lng: Number, lat: Number },
  })
);

module.exports = Settings;
