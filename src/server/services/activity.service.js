const db = require('../models');
const Activity = db.activity;
const { MongoClient, GridFSBucket } = require('mongodb');
const GroupService = require('./group.service');
const Group = require('../models/group.model');

async function filterActivities(body) {
  let query = {};
  let queryGroup = {};

  if (body.phrase) {
    query.$or = [];
    query.$or = [{ name: new RegExp(body.phrase, 'i') }, { 'groups.name': new RegExp(body.phrase, 'i') }];
  }

  if (body.categories && body.categories.length > 0) {
    query.category = {};
    query.category.$in = body.categories;
  }

  if (body.weekDays && body.weekDays.length > 0) {
    queryGroup.weekDay = {};
    queryGroup.weekDay.$in = body.weekDays;
  }

  if (body.minPrice || body.maxPrice) {
    queryGroup.price = {};
    queryGroup.price.$gte = body.minPrice ?? 0;
    queryGroup.price.$lte = body.maxPrice ?? 1000;
  }

  let groups = [];
  if(Object.keys(queryGroup).length !== 0) {
    groups = await Group.find(queryGroup);
  }

  const ids = groups?.map((group) => group.activityId);

  query.guid = {};
  query.guid.$in = ids;

  query.active = true;

  const skip = (body.page - 1) * body.limit;
  const activities = await Activity.find(query)
  .skip(skip ?? 0)
  .limit(body.limit ?? 20);


  // body.maxDistance - calculate all activities in radius
  if (body.coordinates) {
    return activities.filter(
      (activity) =>
        distanceLatLong(
          activity.coordinates.lat,
          activity.coordinates.lng,
          body.coordinates.lat,
          body.coordinates.lng
        ) < body.maxDistance
    );
  }

  return activities;
}

async function getUserActivities(id) {
  const activities = await Activity.find({ createdBy: id });
  for (let i = 0; i < activities.length; i++) {
    const groups = await GroupService.getGroupsForActivity(activities[i].guid);
    activities[i] = { ...activities[i]?._doc, groups };
  }
  return activities;
}

async function getActivityDetails(id) {
  const activity = await Activity.findOne({ guid: id, active: true });
  if (!activity) {
    return null;
  }

  const groups = await GroupService.getGroupsForActivity(id);
  return { ...activity._doc, groups };
}

async function createActivity(data) {
  await Activity.create(data);
  await GroupService.addGroups(data.groups, data.guid);
  return;
}

async function editActivity(id, activity) {
  await Activity.replaceOne({ guid: id }, activity);
  await GroupService.editGroups(activity.groups, id);
  return;
}

async function deleteActivity(id) {
  const activity = await Activity.findOne({ guid: id });
  activity.images.forEach((image) => {
    uri = process.env.MANGO_DB_CONNECTION_STRING;
    const client = new MongoClient(uri);
    const database = client.db('edds');
    const bucket = new GridFSBucket(database, {
      bucketName: 'photos',
    });

    const foundImage = bucket.find({ filename: image });
    foundImage.forEach(async (doc) => await bucket.delete(doc._id));
  });

  await Activity.deleteOne({ guid: id });
  await GroupService.deleteGroupsForActivity(id);
}

async function getActivityCreatedByUser(guid, userId) {
  const activity = await Activity.findOne({ guid, userId });
  const groups = await GroupService.getGroupsForActivity(guid);
  return activity;
}

function distanceLatLong(lat1, lon1, lat2, lon2) {
  const r = 6371; // km
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p))) / 2;

  return 2 * r * Math.asin(Math.sqrt(a));
}

const ActivityService = {
  filterActivities,
  getUserActivities,
  getActivityDetails,
  createActivity,
  editActivity,
  deleteActivity,
  getActivityCreatedByUser,
};

module.exports = ActivityService;
