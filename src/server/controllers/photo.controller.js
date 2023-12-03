const PhotoService = require('../services/photo.service');

exports.uploadPhoto = async (req, res) => {
  try {
    await PhotoService.uploadPhoto(req, res);

    return res.send({
      message: 'File has been uploaded.',
    });
  } catch (error) {
    return res.status(500).send({
      message: `Error when trying upload image: ${error}`,
    });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    await PhotoService.deletePhoto(req.query?.id);
    return res.status(200);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

exports.getPhoto = async (req, res) => {
  try {
    const downloadStream = await PhotoService.getPhotoDownloadStream(req.query['id']);

    downloadStream.on('data', function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on('error', function (err) {
      return res.status(404).send({ message: 'Cannot download the Image!' + err });
    });

    downloadStream.on('end', () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
