const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const accessTokenCookieOptions = {
  expires: new Date(
    Date.now() + Number(config.accessTokenExpiresIn) * 60 * 1000
  ),
  maxAge: Number(config.accessTokenExpiresIn) * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions = {
  expires: new Date(
    Date.now() + Number(config.refreshTokenExpiresIn) * 60 * 1000
  ),
  maxAge: Number(config.refreshTokenExpiresIn) * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

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

    const { access_token, refresh_token } = await signToken(user);

    const authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
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
    return res.status(200).send({ message: "Pomyślnie wylogowano!" });
  } catch (err) {
    this.next(err);
  }
};

exports.refreshAccessTokenHandler = async (req, res, next) => {
  try {
    // Get the refresh token from cookie
    const refresh_token = req.cookies.refresh_token;

    // Validate the Refresh token
    const decoded = verifyJwt(
      refresh_token,
      'refresh_public_token'
    );
    const message = 'Could not refresh access token';
    if (!decoded) {
      return next(new Error(message, 403));
    }

    // Check if the user exist
    const user = await User.findOne({
      username: req.body.username,
    })

    if (!user) {
      return next(new AppError(message, 403));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user._id }, 'auth_private_token', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    // Send the access token as cookie
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err) {
    next(err);
  }
};