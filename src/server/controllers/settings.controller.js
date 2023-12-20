const SettingsService = require('../services/settings.service');

exports.getUserConfig = async (req, res) => {
  const config = await SettingsService.getSettings(req.query.userId);

  if (config) {
    return res.status(200).json(config);
  }
  return res.status(200).json([]);
};

exports.updateUserConfig = async (req, res) => {
  const config = await SettingsService.updateSettings(req.body.userId, req.body.filters);

  if (config) {
    return res.status(200).send({ message: 'ok' });
  }
  return res.status(500).send({ message: 'Could not update user config' });
};
