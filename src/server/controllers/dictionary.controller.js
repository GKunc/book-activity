const DictionaryService = require('../services/dictionary.service');

exports.getActivityCategories = async (req, res) => {
  const categories = await DictionaryService.getActivityCategories();
  return res.send(JSON.stringify(categories));
};
