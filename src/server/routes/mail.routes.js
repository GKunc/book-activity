const { verifySignUp } = require('../middlewares');
const controller = require('../controllers/mail.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    return next();
  });
};
