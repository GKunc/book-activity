const express = require("express");
const cors = require('cors')
const { MongoClient, GridFSBucket } = require("mongodb");
const upload = require("./upload");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// config
const port = process.env.PORT || 8080;
const app_folder = 'dist/book-activity/browser';
const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['html', 'js', 'scss', 'css'],
  index: false,
  maxAge: '1y',
  redirect: true,
}

// create app
const app = express();
app.use(express.json());
app.use(express.static(app_folder, options));
app.use(cors({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
require('./server/routes/auth.routes')(app);
require('./server/routes/activity.routes')(app);
require('./server/routes/favourite.routes')(app);

const db = require("./server/models");
const initializeDb = require("./server/setup/initializeDb");

db.mongoose
  .connect(`${process.env.MANGO_DB_CONNECTION_STRING_PHOTOS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initializeDb();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


// serve angular paths
app.get('/', function (req, res) {
  res.status(200).sendFile(`/`, { root: app_folder });
});

// start listening
app.listen(port, function () {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + port);
});

// ========================================================
// ========================================================
// ========================================================
app.get('/api/activities/check-permissions', async function (req, res) {
  uri = process.env.MANGO_DB_CONNECTION_STRING;
  let query = {};
  const guid = req.query.guid;
  const userId = req.query.userId;

  if (guid) {
    query.guid = req.query.guid;
  }

  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const activities = database.collection('activities');
    const result = await activities.findOne(query);
    if (result.createdBy === userId) {
      res.status(200).send('OK')
      console.log("Permission granted.");
    } else {
      res.status(401).json({ error: 'No permission' })
      console.log("No permission.");
    }
  } finally {
    await client.close();
  }
});

app.post('/api/activities/photos', async function (req, res) {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.send({
      message: "File has been uploaded.",
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
});


app.get('/api/activities/photos', async function (req, res) {
  const id = req.query.id;
  uri = process.env.MANGO_DB_CONNECTION_STRING;
  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const bucket = new GridFSBucket(database, {
      bucketName: 'photos',
    });

    let downloadStream = bucket.openDownloadStreamByName(id);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" + err });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
});

app.delete('/api/activities/photos', async function (req, res) {
  const id = req.query.id;
  uri = process.env.MANGO_DB_CONNECTION_STRING;
  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const bucket = new GridFSBucket(database, {
      bucketName: 'photos',
    });

    const image = bucket.find({filename: id});
    image.forEach(async doc =>  await bucket.delete(doc._id));

   
   
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
    });
  }
});

