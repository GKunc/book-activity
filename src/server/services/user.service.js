const User = require('../models/user.model');

async function getUser(mail) {
  return User.findOne({ mail });
}

const UserService = {
  getUser,
};

module.exports = UserService;
