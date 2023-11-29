const { authJwt } = require('../middlewares');
const controller = require('../controllers/activity.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    return next();
  });

  app.post('/api/activity', [authJwt.verifyToken], controller.insertActivity);
  app.put('/api/activity', [authJwt.verifyToken], controller.replaceActivity);
  app.delete('/api/activity', [authJwt.verifyToken], controller.deleteActivity);
  app.get('/api/activity/details', controller.details);

  app.post('/api/activities/filter', controller.filter);
  app.get('/api/activities/:id', [authJwt.verifyToken], controller.getUserActivities);
  app.get('/api/activities/check-permissions', controller.checkPermissions);
};
