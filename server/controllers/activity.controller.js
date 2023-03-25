const db = require("../models");
const Activity = db.activity;

exports.details = async (req, res) => {
  const id = req.query.id;
  const activity = await Activity.findOne({ guid: id });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(activity));
}

exports.filter = async (req, res) => {
  const body = req.body;
  let query = {}

  if (body.phrase) {
    query.$or = []
    query.$or = [{ name: new RegExp(body.phrase, 'i') }, { 'groups.name': new RegExp(body.phrase, 'i') }];
  }

  if (body.weekDays && body.weekDays.length > 0) {
    query.weekDay = {}
    query.weekDay.$in = body.weekDay;
  }

  if (body.categories && body.categories.length > 0) {
    query.category = {}
    query.category.$in = body.categories;
  }

  query['groups.price'] = {}
  query['groups.price'].$gte = body.minPrice;
  query['groups.price'].$lte = body.maxPrice;

  console.log('Filter activities', query);
  const activity = await Activity.find(query);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(activity));
}

exports.getActivities = async (req, res) => {
  const id = req.query.id;
  let query = {};
  if (id) {
    query.createdBy = id;
  }

  const activity = await Activity.find(query);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(activity));
}

exports.insertActivity = async (req, res) => {
  let data = req.body;
  console.log('insertActivity', data)
  await Activity.create(data);
  res.sendStatus(200);
}

exports.replaceActivity = async (req, res) => {
  const id = req.query.id;
  let query = {};
  if (id) {
    query.guid = id;
  }

  await Activity.replaceOne(query, req.body);
  console.log("Successfully modified ${result.modifiedCount} document.");
  res.sendStatus(200);
}

exports.deleteActivity = async (req, res) => {
  const id = req.query.id;
  let query = {};
  if (id) {
    query.guid = id;
  }

  const result = await Activity.deleteOne(query);
  if (result.deletedCount === 1) {
    res.sendStatus(200);
    console.log("Successfully deleted one document.");
  } else {
    res.sendStatus(404);
    console.log("No documents matched the query. Deleted 0 documents.");
  }
}