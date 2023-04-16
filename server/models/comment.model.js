const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    activityId: String,
    userId: String,
    userName: String,
    content: String,
    rate: Number,
    addedDate: Date,
  })
);

module.exports = Comment;