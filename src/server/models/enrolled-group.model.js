const mongoose = require('mongoose');

const EnrolledGroup = mongoose.model(
  'EnrolledGroup',
  new mongoose.Schema({
    userId: String,
    groups: [String],
  })
);

module.exports = EnrolledGroup;
