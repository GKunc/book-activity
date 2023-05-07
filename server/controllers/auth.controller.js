const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
const { v4: uuidv4 } = require('uuid');

var bcrypt = require('bcryptjs');
const mailController = require('./mail.controller');

const accessTokenCookieOptions = {
  expires: new Date(Date.now() + Number(config.accessTokenExpiresIn) * 60 * 1000),
  maxAge: Number(config.accessTokenExpiresIn) * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions = {
  expires: new Date(Date.now() + Number(config.refreshTokenExpiresIn) * 60 * 1000),
  maxAge: Number(config.refreshTokenExpiresIn) * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

exports.signup = async (req, res) => {
  const confirmationSecret = uuidv4();

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    isConfirmed: false,
    createdAt: new Date(),
    confirmationSecret,
  });

  if (req.body.roles) {
    const roles = await Role.find({ name: { $in: req.body.roles } });
    user.roles = roles.map((role) => role._id);
    if (!roles) {
      res.status(500).send({ message: 'Rola nie istnieje' });
    }

    const newUser = await user.save();
    if (newUser) {
      console.log(newUser);
      mailController.sendConfirmationEmail({ userId: user.id, confirmationSecret });
      console.log('Poprawnie zarejestrowano uzytkownika!');
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
    isConfirmed: true,
  })
    .populate('roles', '-__v')
    .exec();

  if (!user) {
    return res.status(401).send({ message: 'Niepoprawny email lub hasło' });
  }

  if (!req.body.googleLogin) {
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Niepoprawny email lub hasło' });
    }
  }

  const { access_token, refresh_token } = await signToken(user);

  const authorities = [];

  for (let i = 0; i < user.roles.length; i++) {
    authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
  }

  res.cookie('access_token', access_token, accessTokenCookieOptions);
  res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
  res.cookie('logged_in', true, {
    ...accessTokenCookieOptions,
    httpOnly: false,
  });

  // Send Access Token
  res.status(200).json({
    access_token,
    refresh_token,
  });
};

exports.signout = async (req, res) => {
  try {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', {
      maxAge: 1,
    });
    return res.status(200).send({ message: 'Pomyślnie wylogowano!' });
  } catch (err) {
    this.next(err);
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const x = await User.findById(req.body.userId);
    const result = await User.updateOne({ _id: req.body.userId }, { $set: { isConfirmed: true } });

    if (result.modifiedCount > 0) {
      return res.send(JSON.stringify({ isSuccess: true, message: 'Pomyślnie potwierdzono email!' }));
    } else {
      return res.send(JSON.stringify({ isSuccess: false, message: 'Email jest juz potwierdzony!' }));
    }
  } catch (err) {
    this.next(err);
    return res.send(JSON.stringify({ isSuccess: false, message: 'Nie mozna potwierdzic adresu email!' }));
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
    console.log('REFRESH TOKEN');

    // Validate the Refresh token
    const decoded = verifyRefreshToken(req, res, next);

    const message = 'Could not refresh access token';
    if (!decoded) {
      return next(new Error(message, 403));
    }

    // Check if the user exist
    const user = await User.findOne({
      username: req.query.username,
    });

    if (!user) {
      return next(new Error(message, 403));
    }

    // Sign new access token
    const access_token = signJwt({ id: user._id, username: user.username, email: user.email }, 'auth_private_token', {
      expiresIn: `${Number(config.accessTokenExpiresIn)}m`,
    });

    // Send the access token as cookie
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    res.status(200).json({
      access_token,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.query.userId,
    });

    console.log('getUser', user);

    if (!user) {
      return next(new Error(message, 403));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
