const Settings = require('../models/settings.model');

async function getSettings(userId) {
  return Settings.findOne({ userId });
}

async function updateSettings(userId) {
  return Settings.findOne({ userId });
}

const SettingsService = {
  getSettings,
  updateSettings,
};

module.exports = SettingsService;
