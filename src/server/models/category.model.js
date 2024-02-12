const mongoose = require('mongoose');

const Category = mongoose.model(
  'Category',
  new mongoose.Schema({
    id: Number,
    name: String,
    iconSvg: String,
  })
);

module.exports = Category;
