const ActivityService = require('../services/activity.service');

exports.filter = async (req, res) => {
  const activities = await ActivityService.filterActivities(req.body);
  return res.send(JSON.stringify(activities));
};

exports.getUserActivities = async (req, res) => {
  const activity = await ActivityService.getUserActivities(req?.params?.id);
  return res.send(JSON.stringify(activity));
};

exports.details = async (req, res) => {
  const activity = await ActivityService.getActivityDetails(req.query.id);
  return res.send(JSON.stringify(activity));
};

exports.insertActivity = async (req, res) => {
  req.body.active = true;
  await ActivityService.createActivity(req.body);
  return res.sendStatus(200);
};

exports.replaceActivity = async (req, res) => {
  const result = await ActivityService.editActivity(req.query.id, req.body);
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

exports.checkPermissions = async (req, res) => {
  const result = await getActivityCreatedBByUser(req.query.guid, req.query.userId);
  if (result?.createdBy === userId) {
    console.log('Permission granted.');
    return res.status(200).send('OK');
  } else {
    console.log('No permission.');
    return res.status(401).json({ error: 'No permission' });
  }
};
