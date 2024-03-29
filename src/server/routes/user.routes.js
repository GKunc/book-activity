const { authJwt } = require('../middlewares');

const controller = require('../controllers/user.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    return next();
  });

  app.get('/api/user', controller.getUserById);
  app.delete('/api/user', [authJwt.verifyToken], controller.deleteUser);
  app.get('/api/user/enroll/:userId', [authJwt.verifyToken], controller.getEnrolledGroups);
  app.put('/api/user/enroll/:userId', [authJwt.verifyToken], controller.enrollToGroup);
  app.delete('/api/user/enroll/:userId', [authJwt.verifyToken], controller.deleteEnrolledGroup);
};
