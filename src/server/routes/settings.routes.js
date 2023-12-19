const { authJwt } = require('../middlewares');
const controller = require('../controllers/settings.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.get('/api/settings', [authJwt.verifyToken], controller.getUserConfig);
  app.put('/api/settings', [authJwt.verifyToken], controller.updateUserConfig);
};
