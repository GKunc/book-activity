const UserService = require('../services/user.service');
const stripe = require('stripe')(process.env.PAYMENT_API_KEY);

exports.getUserById = async (req, res) => {
  const user = await UserService.getUserById(req.query.userId);
  if (!user) {
    return res.status(403).json({ message: 'User with provided email does not exist' });
  }

  res.status(200).json(user);
};

exports.getUserByEmail = async (req, res) => {
  const user = await UserService.getUserByEmail(req.query.email);
  if (!user) {
    return res.status(403).json({ message: 'User with provided email does not exist' });
  }

  res.status(200).json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await UserService.getUserById(req.body.userId);
  await UserService.deleteUserById(req.body.userId);
  const deleted = await stripe.customers.del(user.billingId);

  if (deleted) {
    return res.status(200).json({ message: 'ok' });
  }
  return res.status(500).send({ message: 'Could not remove user' });
};
