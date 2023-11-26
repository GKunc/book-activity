const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

var storage = new GridFsStorage({
  url: process.env.MANGO_DB_CONNECTION_STRING_PHOTOS,
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg'];
    console.log('filename: ', file.originalname);
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'photos',
      filename: `${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).single('file');
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
