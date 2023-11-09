const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
const { v4: uuidv4 } = require('uuid');

var bcrypt = require('bcryptjs');
const mailController = require('./mail.controller');
const stripe = require('stripe')(process.env.PAYMENT_API_KEY);

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

exports.verifyToken = async (req, res) => {
  try {
    return res.status(200).send({ message: 'Sesja przywrocona' });
  } catch (e) {
    // no token
    return res.status(503).send({ message: 'Nie mozna odnowic sesji' });
  }
};

exports.signup = async (req, res) => {
  const confirmationSecret = uuidv4();
  const email = req.body.email;
  const username = req.body.username.toLowerCase();

  console.log('signup email', email);
  customerInfo = await stripe.customers.create({
    email,
    description: username,
  });

  const user = new User({
    username,
    email,
    password: bcrypt.hashSync(req.body.password, 8),
    isConfirmed: !process.env.production,
    createdAt: new Date(),
    confirmationSecret,
    // payment info
    billingId: customerInfo.id,
    paymentEndDate: null,
    package: 'Free',
    isTrail: false,
  });

  if (req.body.roles) {
    const roles = await Role.find({ name: { $in: req.body.roles } });
    user.roles = roles.map((role) => role._id);
    if (!roles) {
      return res.status(500).send({ message: 'Rola nie istnieje' });
    }

    const newUser = await user.save();
    if (newUser) {
      if (process.env.production) {
        mailController.sendConfirmationEmail({ userId: user.id, confirmationSecret });
      }
      console.log('Poprawnie zarejestrowano uzytkownika!');
      return res.send({ message: 'Poprawnie zarejestrowano uzytkownika!' });
    } else {
      return res.status(500).send({ message: 'Nie mozna zarejestrowac uzytkownika' });
    }
  } else {
    return res.status(500).send({ message: 'Nie podano zadnej roli' });
  }
};

exports.signin = async (req, res) => {
  const user = await User.findOne({
    username: req.body.username.toLowerCase(),
    isConfirmed: true,
  })
    .populate('roles', '-__v')
    .exec();

  if (!user) {
    return res.status(401).json({ isSuccess: false, message: 'Niepoprawny email lub hasło' });
  }

  if (!req.body.googleLogin) {
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ isSuccess: false, message: 'Niepoprawny email lub hasło' });
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
  return res.status(200).json({
    isSuccess: true,
    message: 'Poprawnie zalogowano',
    data: { access_token, refresh_token },
  });
};

exports.signout = async (req, res) => {
  try {
    console.log('signout');
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', {
      maxAge: 1,
    });
    return res.send(JSON.stringify({ isSuccess: true, message: 'Pomyślnie wylogowano!' }));
  } catch (err) {
    return this.next(err);
  }
};

exports.confirmEmail = async (req, res) => {
  try {
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
      return res.status(403).send({ message });
    }

    // Check if the user exist
    const user = await User.findOne({
      username: req.query.username.toLowerCase(),
    });

    if (!user) {
      return res.status(403).send({ message });
    }

    // Sign new access token
    const access_token = signJwt(
      { id: user._id, username: user.username.toLowerCase(), email: user.email },
      'auth_private_token',
      {
        expiresIn: `${Number(config.accessTokenExpiresIn)}m`,
      }
    );

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
    return next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.query.userId,
    });

    if (!user) {
      return next(new Error(message, 403));
    }

    res.status(200).json(user);
  } catch (err) {
    return ext(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });

    const result = await User.deleteOne({
      _id: req.body.userId,
    });

    const deleted = await stripe.customers.del(user.billingId);

    if (deleted) {
      res.status(200).send('OK');
    }
    res.status(500).send('Could not remove user');
  } catch (err) {
    return next(err);
  }
};
