const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    guid: String,
    isConfirmed: Boolean,
    createdAt: Date,

    billingId: String,
    paymentEndDate: Date,
    package: { type: String, enum: ['Free', 'Starter', 'Standard', 'Premium'], default: 'Free' },
    isTrail: Boolean,
    trailEnds: Date,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  })
);

module.exports = User;
