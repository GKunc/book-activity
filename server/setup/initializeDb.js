const db = require("../models");

const Role = db.role;
const WeekDay = db.weekDay;

async function initializeDb() {
    const roles = await Role.find({});
    if (roles && roles.length === 0) {
      new Role({
        name: "user"
      }).save();
  
      new Role({
        name: "moderator"
      }).save();
  
      new Role({
        name: "admin"
      }).save();
    }
  }
  
  module.exports = initializeDb;