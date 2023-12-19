const Settings = require('../models/settings.model');

async function getSettings(userId) {
  return Settings.findOne({ userId });
}

async function updateSettings(userId, filters) {
  const settings = await getSettings(userId);
  if (settings) {
    return Settings.replaceOne({ userId }, { ...filters, userId });
  }
  return Settings.create({ ...filters, userId });
}

const SettingsService = {
  getSettings,
  updateSettings,
};

module.exports = SettingsService;
