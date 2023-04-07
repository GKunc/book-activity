const mongoose = require("mongoose");

const Favourite = mongoose.model(
  "Favourite",
  new mongoose.Schema({
   userId: String,
   favourites: [String]
  })
);

module.exports = Favourite;