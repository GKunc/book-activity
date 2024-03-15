const db = require('../models');
const AddressTab = require('../models/addressTab.model');
const Group = require('../models/group.model');

async function addAddressTab(addressTabs, activityId) {
  for (let i = 0; i < addressTabs.length; i++) {
    await addGroups(addressTabs[i].groups, addressTabs[i].addressId, activityId);
    await AddressTab.create({ address: addressTabs[i].address, addressId: addressTabs[i].addressId, activityId: activityId });
  }
  return;
}

async function addGroups(groups, addressId, activityId) {
  for (let i = 0; i < groups.length; i++) {
    await Group.create({ ...groups[i], addressId, activityId });
  }
  return;
}

async function editGroups(groups, activityId) {
  await Group.deleteMany({ activityId });
  await addGroups(groups, activityId);
}

async function getGroupsForActivity(activityId) {
  const addressTabs = await AddressTab.find({ activityId });
  for (let i = 0; i < addressTabs.length; i++) {
    const groups = await Group.find({ addressId: addressTabs[i].addressId });
    addressTabs[i] = {...addressTabs[i]._doc, groups}
  }
  return addressTabs;
}

async function deleteGroupsForActivity(activityId) {
  return Group.deleteMany({ activityId });
}

const GroupService = {
  addGroups,
  editGroups,
  getGroupsForActivity,
  deleteGroupsForActivity,
  addAddressTab,
};

module.exports = GroupService;
