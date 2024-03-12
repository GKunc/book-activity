const controller = require('../controllers/environment.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    return next();
  });

  app.get('/api/environment/config', controller.getEnvironmentConfig);

};
