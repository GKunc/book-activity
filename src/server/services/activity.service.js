const db = require('../models');
const Activity = db.activity;
const { MongoClient, GridFSBucket } = require('mongodb');

async function filterActivities(body) {
  let query = {};

  if (body.phrase) {
    query.$or = [];
    query.$or = [{ name: new RegExp(body.phrase, 'i') }, { 'groups.name': new RegExp(body.phrase, 'i') }];
  }

  if (body.weekDays && body.weekDays.length > 0) {
    query.weekDay = {};
    query.weekDay.$in = body.weekDays;
  }

  if (body.categories && body.categories.length > 0) {
    query.category = {};
    query.category.$in = body.categories;
  }

  query['groups.price'] = {};
  query['groups.price'].$gte = body.minPrice ?? 0;
  query['groups.price'].$lte = body.maxPrice ?? 1000;
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
  return Activity.find({ createdBy: id });
}

async function getActivityDetails(id) {
  return Activity.findOne({ guid: id, active: true });
}

async function createActivity(data) {
  return Activity.create(data);
}

async function editActivity(id, activity) {
  return Activity.replaceOne({ guid: id }, activity);
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

  return Activity.deleteOne(query);
}

async function getActivityCreatedBByUser(guid, userId) {
  return Activity.findOne({ guid, userId });
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
  getActivityCreatedBByUser,
};

module.exports = ActivityService;
