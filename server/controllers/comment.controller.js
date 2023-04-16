const db = require("../models");
const Comment = db.comment;

exports.getComments = async (req, res) => {
  const activityId = req.query.activityId;
  const comments = await Comment.find({ activityId });
  console.log(activityId, ', getComments: ', comments)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
}

exports.addComment = async (req, res) => {
  let data = req.body;
  console.log('addComment', data)
  await Comment.create(data);
  res.sendStatus(200);
}
