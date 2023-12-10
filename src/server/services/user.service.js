const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function getUserByEmail(email) {
  email = email.toLowerCase().trim();
  return User.findOne({ email });
}

async function getUserById(_id) {
  return await User.findOne({ _id });
}

async function getUserByUsername(username) {
  username = username.toLowerCase().trim();
  return await User.findOne({ username });
}

async function getUserByUsernameAndEmail(username, email) {
  username = username.toLowerCase().trim();
  email = email.toLowerCase().trim();
  return await User.findOne({
    username,
    email,
  });
}

async function getUserByUsernameAndEmailAndPassword(username, email, password) {
  const user = await getUserByUsernameAndEmail(username, email);
  return bcrypt.compareSync(password, user?.password) ? user : null;
}

async function getUserConfirmedByUsername(username) {
  username = username.toLowerCase().trim();
  return await User.findOne({
    username,
    isConfirmed: true,
  });
}

async function getUserConfirmedByEmail(email) {
  email = email.toLowerCase().trim();
  return await User.findOne({
    email,
    isConfirmed: true,
  });
}

async function deleteUserById(_id) {
  return await User.deleteOne({ _id });
}

async function createUser(username, email, password, billingId) {
  username = username.toLowerCase().trim();
  email = email.toLowerCase().trim();

  return new User({
    username,
    email,
    password: bcrypt.hashSync(password, 8),
    isConfirmed: false,
    createdAt: new Date(),
    billingId,
    paymentEndDate: null,
    package: 'Free',
    isTrail: false,
  });
}

const UserService = {
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserByUsernameAndEmail,
  getUserByUsernameAndEmailAndPassword,
  getUserConfirmedByUsername,
  getUserConfirmedByEmail,
  deleteUserById,
  createUser,
};

module.exports = UserService;
