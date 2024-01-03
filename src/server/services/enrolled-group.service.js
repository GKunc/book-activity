const EnrolledGroups = require('../models/enrolled-group.model');
const Activity = require('../models/activity.model');
const Group = require('../models/group.model');

async function getEnrolledGroups(userId) {
  const found = await EnrolledGroups.findOne({ userId });
  const groups = found?.groups;
  const result = [];
  for (let i = 0; i < groups?.length; i++) {
    const group = await Group.findOne({ _id: groups[i] });

    result.push(group);
  }

  return result;
}

async function deleteEnrolledGroup(userId, groupId) {
  return EnrolledGroups.updateOne({ userId }, { $pull: { groups: groupId } });
}

async function enrollToGroup(userId, groupId) {
  const activities = await EnrolledGroups.findOne({ userId });
  if (activities?.groups) {
    // update current
    let groups = activities?.groups;
    if (!groups?.find((group) => group === groupId)) {
      groups = [...groups, groupId];
      await EnrolledGroups.replaceOne({ userId }, { userId, groups });
    }
    return;
  } else {
    // create new
    return await EnrolledGroups.create({
      userId,
      groups: [groupId],
    });
  }
}

const EnrolledGroupsService = {
  getEnrolledGroups,
  deleteEnrolledGroup,
  enrollToGroup,
};

module.exports = EnrolledGroupsService;
