const { authJwt } = require('../middlewares');
const controller = require('../controllers/payments.controller');
const express = require('express');

module.exports = function (app) {
  app.post('/api/payment/subscription', [authJwt.verifyToken], controller.createSubscription);
  app.post('/api/payment/edit-subscription', [authJwt.verifyToken], controller.editSubscription);
  app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), controller.listenForSubscriptionEvents);
};
