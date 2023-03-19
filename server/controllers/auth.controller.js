const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  if (req.body.roles) {
    const roles = await Role.find({ name: { $in: req.body.roles } });
    user.roles = roles.map((role) => role._id);
    if(!roles) {
      res.status(500).send({ message: 'Rola nie istnieje' });
    }

    const newUser = user.save();
    if(newUser) {
      res.send({ message: 'Poprawnie zarejestrowano uzytkownika!' });
    } else {
      res.status(500).send({ message: 'Nie mozna zarejestrowac uzytkownika' });
      return;
    }
  } else {
    res.status(500).send({ message: 'Nie podano zadnej roli' });
  }
};

exports.signin = async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec();
   
    if (!user) {
      return res.status(401).send({ message: "Niepoprawny email lub hasło" });
    }

    if(!req.body.googleLogin) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Niepoprawny email lub hasło" });
      }
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    req.session.token = token;

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "Pomyślnie wylogowano!" });
  } catch (err) {
    this.next(err);
  }
};