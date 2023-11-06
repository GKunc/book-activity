const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  const userName = await User.findOne({
    username: req.body.username.toLowerCase(),
  }).exec();

  if (userName) {
    return res.status(400).send({ field: 'login', errorType: 'uniqueUser', message: 'Nazwa zajeta' });
  }

  // Email
  const userEmail = await User.findOne({ email: req.body.email });
  if (userEmail) {
    return res.status(400).send({ field: 'email', errorType: 'uniqueEmail', message: 'Email jest zajety' });
  }
  next();
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

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
