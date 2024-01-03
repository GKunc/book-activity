const db = require('../models');
const Group = require('../models/group.model');

async function addGroups(groups, activityId) {
  for (let i = 0; i < groups.length; i++) {
    await Group.create({ ...groups[i], activityId });
  }
  return;
}

async function getGroupsForActivity(activityId) {
  return Group.find({ activityId });
}

async function deleteGroupsForActivity(activityId) {
  return Group.deleteMany({ activityId });
}

const GroupService = {
  addGroups,
  getGroupsForActivity,
  deleteGroupsForActivity,
};

module.exports = GroupService;
