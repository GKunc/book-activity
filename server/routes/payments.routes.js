const { authJwt } = require('../middlewares');
const controller = require('../controllers/payments.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/payment/subscribe', controller.createSubscription);
  app.post('/api/payment/webhook', controller.listenForSubscriptionEvents);
};
