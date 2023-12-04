const User = require('../models/user.model');

async function resetPassword(activityId) {
  return Comment.find({ activityId });
}

const AuthService = {
  resetPassword,
};

module.exports = AuthService;
