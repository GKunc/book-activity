const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  const userName = await User.findOne({
    username: req.body.username
  }).exec();
  
  if (userName) {
    res.status(400).send({ field: "login", errorType: "uniqueUser", message: "Nazwa zajeta" });
    return;
  }

  // Email
  const userEmail = await User.findOne({ email: req.body.email });
  if (userEmail) {
    res.status(400).send({ field: "email", errorType: "uniqueEmail", message: "Email jest zajety" });
    return;
  }
    next();
}

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;