module.exports = {
    auth_private_token: process.env.AUTH_PRIVATE_KEY,
    auth_public_token: process.env.AUTH_PUBLIC_KEY,
    refresh_private_token: process.env.REFRESH_PRIVATE_KEY,
    refresh_public_token: process.env.REFRESH_PUBLIC_KEY,

    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 1440
};