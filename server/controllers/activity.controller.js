const db = require('../models');
const Activity = db.activity;
const { MongoClient, GridFSBucket } = require('mongodb');

exports.filter = async (req, res) => {
  const body = req.body;
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

  const skip = (body.page - 1) * body.limit;
  const activity = await Activity.find(query)
    .skip(skip ?? 0)
    .limit(body.limit ?? 20);
  console.log('Filter activities', query, ',skip: ', skip, ',limit: ', body.limit, 'result: ', activity.length);
  return res.send(JSON.stringify(activity));
};

exports.getUserActivities = async (req, res) => {
  console.log('getUserActivities', req?.query);
  const id = req?.query?.id;
  let query = {};
  if (id) {
    query.createdBy = id;
  }

  const activity = await Activity.find(query);
  return res.send(JSON.stringify(activity));
};

exports.details = async (req, res) => {
  const id = req.query.id;
  const activity = await Activity.findOne({ guid: id });
  return res.send(JSON.stringify(activity));
};

exports.insertActivity = async (req, res) => {
  let data = req.body;
  console.log('insertActivity', data);
  await Activity.create(data);
  return res.sendStatus(200);
};

exports.replaceActivity = async (req, res) => {
  const id = req.query.id;
  let query = {};
  if (id) {
    query.guid = id;
  }

  await Activity.replaceOne(query, req.body);
  console.log('Successfully modified ${result.modifiedCount} document.');
  return res.sendStatus(200);
};

exports.deleteActivity = async (req, res) => {
  const id = req.query.id;
  let query = {};
  if (id) {
    query.guid = id;
  }

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

  const result = await Activity.deleteOne(query);
  if (result.deletedCount === 1) {
    console.log('Successfully deleted one document.');
    return res.sendStatus(200);
  } else {
    console.log('No documents matched the query. Deleted 0 documents.');
    return res.sendStatus(404);
  }
};
