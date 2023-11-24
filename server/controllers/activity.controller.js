const ActivityService = require('../services/activity.service');

exports.filter = async (req, res) => {
  const activities = await ActivityService.filterActivities(req.body);
  console.log('Filter activities', query, ',skip: ', skip, ',limit: ', body.limit, 'result: ', activities.length);
  return res.send(JSON.stringify(activities));
};

exports.getUserActivities = async (req, res) => {
  const activity = await ActivityService.getUserActivities(req.body);
  return res.send(JSON.stringify(activity));
};

exports.details = async (req, res) => {
  const activity = await ActivityService.getActivityDetails(req.query.id);
  return res.send(JSON.stringify(activity));
};

exports.insertActivity = async (req, res) => {
  await ActivityService.createActivity(req.body);
  return res.sendStatus(200);
};

exports.replaceActivity = async (req, res) => {
  const result = await ActivityService.editActivity(req.query.id);
  console.log(`Successfully modified ${result.modifiedCount} document.`);
  return res.sendStatus(200);
};

exports.deleteActivity = async (req, res) => {
  const result = await ActivityService.deleteActivity(req.query.id);

  if (result.deletedCount === 1) {
    console.log('Successfully deleted one document.');
    return res.sendStatus(200);
  } else {
    console.log('No documents matched the query. Deleted 0 documents.');
    return res.sendStatus(404);
  }
};
