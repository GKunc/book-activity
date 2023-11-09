const { authJwt } = require('../middlewares');
const controller = require('../controllers/activity.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    return next();
  });

  app.get('/api/activities/details', controller.details);

  app.post('/api/activities', [authJwt.verifyToken], controller.insertActivity);
  app.get('/api/user-activities', [authJwt.verifyToken], controller.getUserActivities);
  app.put('/api/activities', [authJwt.verifyToken], controller.replaceActivity);
  app.delete('/api/activities', [authJwt.verifyToken], controller.deleteActivity);

  app.post('/api/activities/filter', controller.filter);
};
