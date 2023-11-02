const { authJwt } = require('../middlewares');
const controller = require('../controllers/payments.controller');
const express = require('express');

module.exports = function (app) {
  app.post('/api/payment/subscribe', controller.createSubscription);
  app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), controller.listenForSubscriptionEvents);
};
