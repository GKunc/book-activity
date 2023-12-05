const User = require('../models/user.model');

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getUserById(_id) {
  return await User.findOne({ _id });
}

async function deleteUserById(_id) {
  return await User.deleteOne({ _id });
}

const UserService = {
  getUserByEmail,
  getUserById,
  deleteUserById,
};

module.exports = UserService;
