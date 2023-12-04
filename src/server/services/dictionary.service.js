const Category = require('../models/category.model');

async function getActivityCategories() {
  return Category.find();
}

const DictionaryService = {
  getActivityCategories,
};

module.exports = DictionaryService;
