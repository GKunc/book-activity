const CommentService = require('../services/comment.service');

exports.getComments = async (req, res) => {
  const comments = await CommentService.getComments(req.query.activityId);
  return res.send(JSON.stringify(comments));
};

exports.addComment = async (req, res) => {
  await CommentService.addComment(req.body);
  return res.sendStatus(200);
};
