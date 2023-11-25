const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

signJwt = (payload, key, options) => {
  const privateKey = Buffer.from(config[key], 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
    allowInsecureKeySizes: true,
  });
};

verifyToken = (req, res, next) => {
  let token = req?.cookies?.access_token;
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  try {
    const publicKey = Buffer.from(config.auth_public_token, 'base64').toString('ascii');
    jwt.verify(token, publicKey);
    next();
  } catch (error) {
    console.log('error', error);
    return res.status(401).send({ message: 'Unauthorized!' });
  }
};

verifyRefreshToken = (req, res, next) => {
  let token = req?.cookies?.refresh_token;

  if (!token) {
    return null;
  }

  try {
    const publicKey = Buffer.from(config.refresh_public_token, 'base64').toString('ascii');
    return jwt.verify(token, publicKey);
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

signTokenShort = async (user) => {
  // Sign the access token
  const access_token = signJwt(
    { id: user._id, username: user.username.toLowerCase(), email: user.email },
    'auth_private_token',
    {
      expiresIn: `5m`,
    }
  );

  // Sign the refresh token
  const refresh_token = signJwt(
    { id: user._id, username: user.username.toLowerCase(), email: user.email },
    'refresh_private_token',
    {
      expiresIn: `5m`,
    }
  );

  // Return access token
  return { access_token, refresh_token };
};

signToken = async (user) => {
  // Sign the access token
  const access_token = signJwt(
    { id: user._id, username: user.username.toLowerCase(), email: user.email },
    'auth_private_token',
    {
      expiresIn: `${Number(config.accessTokenExpiresIn)}m`,
    }
  );

  // Sign the refresh token
  const refresh_token = signJwt(
    { id: user._id, username: user.username.toLowerCase(), email: user.email },
    'refresh_private_token',
    {
      expiresIn: `${Number(config.refreshTokenExpiresIn)}m`,
    }
  );

  // Return access token
  return { access_token, refresh_token };
};

const authJwt = {
  signJwt,
  signToken,
  signTokenShort,
  verifyToken,
  verifyRefreshToken,
};
module.exports = authJwt;
