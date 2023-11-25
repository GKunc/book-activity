const Comment = require('../models/comment.model');

async function getComments(activityId) {
  return Comment.find({ activityId });
}

async function addComment(comment) {
  return Comment.create(comment);
}

const CommentService = {
  getComments,
  addComment,
};

module.exports = CommentService;
