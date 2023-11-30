const UserService = require('../services/user.service');

exports.getUser = async (req, res) => {
  const user = await UserService.getUser(req.query.email);
  return res.send(JSON.stringify(user));
};
