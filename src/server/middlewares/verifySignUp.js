const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
var bcrypt = require('bcryptjs');

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  const userName = await User.findOne({
    username: req.body.username.toLowerCase(),
  });
  const userEmail = await User.findOne({ email: req.body.email });
  const user = await User.findOne({
    username: req.body.username.toLowerCase(),
    email: req.body.email,
  });

  if (userName && userEmail && passwordMatch) {
    return next();
  }

  if (userName) {
    return res.status(400).send({ field: 'login', errorType: 'uniqueUser', message: 'Nazwa zajeta' });
  }

  // Email
  if (userEmail) {
    return res.status(400).send({ field: 'email', errorType: 'uniqueEmail', message: 'Email jest zajety' });
  }

  if (user) {
    const passwordMatch = bcrypt.compareSync(req.body.password, user?.password);
  }

  return next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
      }
    }
  }

  return next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
