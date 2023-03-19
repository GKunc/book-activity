const mongoose = require("mongoose");

const Activity = mongoose.model(
  "Activity",
  new mongoose.Schema({
    name: String,
    guid: String,
    createdBy: String,
    nubmerOfImages: Number,
    category: Number, 
    description: String,
    groups: [{
        name: String,
        duration: Number,
        price: Number,
        time: String,
        weekDay: Number, 
    }],
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