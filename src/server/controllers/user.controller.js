const UserService = require('../services/user.service');
const EnrolledGroupsService = require('../services/enrolled-group.service');
const stripe = require('stripe')(process.env.PAYMENT_API_KEY);

exports.getEnrolledGroups = async (req, res) => {
  const enrolledGroups = await EnrolledGroupsService.getEnrolledGroups(req?.params.userId);
  res.status(200).json(enrolledGroups);
};

exports.enrollToGroup = async (req, res) => {
  await EnrolledGroupsService.enrollToGroup(req?.params.userId, req.body.groupId);
  res.status(200).json({ message: 'ok' });
};

exports.deleteEnrolledGroup = async (req, res) => {
  await EnrolledGroupsService.deleteEnrolledGroup(req?.params.userId, req.query?.groupId);
  res.status(200).json({ message: 'ok' });
};

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

exports.getUserConfig = async (req, res) => {
  const config = await UserService.getUserConfig(req.body.userId);

  if (config) {
    res.status(200).json(config);
  }
  return res.status(500).send({ message: 'Could not get user config' });
};
