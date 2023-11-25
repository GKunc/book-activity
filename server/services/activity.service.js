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
  return Activity.find(query)
    .skip(skip ?? 0)
    .limit(body.limit ?? 20);
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
const ActivityService = {
  filterActivities,
  getUserActivities,
  getActivityDetails,
  createActivity,
  editActivity,
  deleteActivity,
};

module.exports = ActivityService;
