const { verifySignUp, authJwt } = require('../middlewares');

const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.post(
    '/api/auth/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  app.post('/api/auth/signin', controller.signin);
  app.get('/api/auth/refresh', controller.refreshAccessToken);
  app.post('/api/auth/signout', controller.signout);
  app.post('/api/auth/confirmEmail', controller.confirmEmail);
  app.get('/api/auth/getUser', controller.getUser);
  app.post('/api/auth/verifyToken', [authJwt.verifyToken], controller.verifyToken);
};
