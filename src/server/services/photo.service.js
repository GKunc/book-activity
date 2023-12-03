const { MongoClient, GridFSBucket } = require('mongodb');
const uploadFilesMiddleware = require('../middlewares/upload');

async function uploadPhoto(req, res) {
  await uploadFilesMiddleware(req, res);
}

async function getPhotoDownloadStream(id) {
  const uri = process.env['MANGO_DB_CONNECTION_STRING'];
  const client = new MongoClient(uri);
  const database = client.db('edds');
  const bucket = new GridFSBucket(database, {
    bucketName: 'photos',
  });

  return bucket.openDownloadStreamByName(id);
}

async function deletePhoto(id) {
  const uri = process.env['MANGO_DB_CONNECTION_STRING'];
  const client = new MongoClient(uri);
  const database = client.db('edds');
  const bucket = new GridFSBucket(database, {
    bucketName: 'photos',
  });

  const image = bucket.find({ filename: id });
  image.forEach((doc) => {
    bucket.delete(doc._id);
  });
}

const PhotoService = {
  uploadPhoto,
  getPhotoDownloadStream,
  deletePhoto,
};

module.exports = PhotoService;
