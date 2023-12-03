const PaymentsService = require('../services/payments.service');

exports.editSubscription = async (req, res) => {
  const session = await PaymentsService.editSubscription(req.body.userId);
  return res.send(JSON.stringify(session.url));
};

exports.createSubscription = async (req, res) => {
  const session = await PaymentsService.createSubscription(req.body.userId, req.body.packageId);
  return res.send(JSON.stringify(session.url));
};

exports.listenForSubscriptionEvents = async (req, res) => {
  await PaymentsService.paymentsWebhook(req.body, req.headers);
  return res.send();
};
