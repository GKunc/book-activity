const config = require('../config/auth.config');
const db = require('../models');
const Role = db.role;

const stripe = require('stripe')(process.env.PAYMENT_API_KEY);
const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');

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

exports.resetPassword = async (req, res) => {
  const result = await AuthService.resetPassword(req.body.email, req.body.oldPassword, req.body.newPassword);

  if (result) {
    return res.status(200).send({ message: 'Hasło zresetowane' });
  }
  return res.status(400).send({ message: 'Stare hasło nieprawidłowe lub email nie istnieje' });
};

exports.verifyToken = async (req, res) => {
  try {
    return res.status(200).send({ message: 'Sesja przywrocona' });
  } catch (e) {
    return res.status(503).send({ message: 'Nie mozna odnowic sesji' });
  }
};

exports.signup = async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  let user = await UserService.getUserByUsernameAndEmailAndPassword(username, email);

  if (!user) {
    customerInfo = await stripe.customers.create({
      email,
      description: username,
    });

    user = await UserService.createUser(username, email, password, customerInfo.id);
  }

  if (req.body.roles) {
    const roles = await Role.find({ name: { $in: req.body.roles } });
    user.roles = roles.map((role) => role._id);
    if (!roles) {
      // usun uzytkownika
      return res.status(500).send({ message: 'Rola nie istnieje' });
    }

    const newUser = await user.save();
    if (newUser) {
      console.log('Poprawnie zarejestrowano uzytkownika!');

      const { access_token, refresh_token } = await signTokenShort(user);

      res.cookie('access_token', access_token, accessTokenCookieOptions);
      res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
      res.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      return res.status(200).json({ userId: newUser._id });
    } else {
      return res.status(500).send({ message: 'Nie mozna zarejestrowac uzytkownika' });
    }
  } else {
    return res.status(500).send({ message: 'Nie podano zadnej roli' });
  }
};

exports.signin = async (req, res) => {
  let user = await UserService.getUserConfirmedByUsername(req.body.username);

  if (!user) {
    user = await UserService.getUserConfirmedByEmail(req.body.username);
  }

  if (!user) {
    return res.status(401).json({ isSuccess: false, message: 'Niepoprawny email lub hasło' });
  }

  const { access_token, refresh_token } = await signToken(user);

  res.cookie('access_token', access_token, accessTokenCookieOptions);
  res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
  res.cookie('logged_in', true, {
    ...accessTokenCookieOptions,
    httpOnly: false,
  });

  return res.status(200).json({
    message: 'Poprawnie zalogowano',
    data: { access_token, refresh_token },
  });
};

exports.signout = async (req, res, next) => {
  try {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', {
      maxAge: 1,
    });
    return res.send(JSON.stringify({ isSuccess: true, message: 'Pomyślnie wylogowano!' }));
  } catch (err) {
    return next(err);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
    console.log('REFRESH TOKEN');

    const decoded = await verifyRefreshToken(req, res, next);
    const message = 'Could not refresh access token';
    if (!decoded) {
      return res.status(403).send({ message });
    }

    const user = await UserService.getUserByUsername(req.query.username);

    if (!user) {
      return res.status(403).send({ message });
    }

    const access_token = signJwt(
      { id: user._id, username: user.username.toLowerCase(), email: user.email },
      'auth_private_token',
      {
        expiresIn: `${Number(config.accessTokenExpiresIn)}m`,
      }
    );

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
