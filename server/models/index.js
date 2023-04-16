const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.activity = require("./activity.model");
db.favourite = require("./favourite.model");
db.comment = require("./comment.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;