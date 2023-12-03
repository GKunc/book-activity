const { authJwt } = require('../middlewares');
const controller = require('../controllers/photo.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/activities/photos', [authJwt.verifyToken], controller.uploadPhoto);
  app.delete('/api/activities/photos', [authJwt.verifyToken], controller.deletePhoto);
  app.get('/api/activities/photos', controller.getPhoto);
};
