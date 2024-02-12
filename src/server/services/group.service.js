const db = require('../models');
const Group = require('../models/group.model');

async function addGroups(groups, activityId) {
  for (let i = 0; i < groups.length; i++) {
    await Group.create({ ...groups[i], activityId });
  }
  return;
}

async function editGroups(groups, activityId) {
  await Group.deleteMany({ activityId });
  await addGroups(groups, activityId);
}

async function getGroupsForActivity(activityId) {
  return Group.find({ activityId });
}

async function deleteGroupsForActivity(activityId) {
  return Group.deleteMany({ activityId });
}

const GroupService = {
  addGroups,
  editGroups,
  getGroupsForActivity,
  deleteGroupsForActivity,
};

module.exports = GroupService;
