const UserService = require('../services/user.service');
const bcrypt = require('bcryptjs');

async function resetPassword(email, oldPassword, newPassword) {
  const user = await UserService.getUserByEmail(email);

  if (user != null && bcrypt.compareSync(oldPassword, user?.password)) {
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    return true;
  }

  return false;
}

const AuthService = {
  resetPassword,
};

module.exports = AuthService;
