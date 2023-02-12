const express = require("express");
const cors = require('cors')
const { MongoClient, GridFSBucket } = require("mongodb");
const os = require('os');
const upload = require("./upload");
const fs = require('fs');
const path = require('path');

// config
const port = process.env.PORT || 8080;
const app_folder = 'dist/book-activity/';
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
app.use(cors({
  origin: 'http://localhost:4200'
}));

// serve angular paths
app.get('/', function (req, res) {
  res.status(200).sendFile(`/`, { root: app_folder });
});

app.get('/api/activities/detail', async function (req, res) {
  const id = req.query.id;
  uri = process.env.MANGO_DB_CONNECTION_STRING;

  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const activities = database.collection('activities');
    const activity = await activities.findOne({ guid: id });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(activity));
  } finally {
    await client.close();
  }
});

app.get('/api/activities', async function (req, res) {
  uri = process.env.MANGO_DB_CONNECTION_STRING;

  console.log('Get activities');
  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const activities = database.collection('activities');
    const activity = await activities.find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(activity));
  } finally {
    await client.close();
  }
});

app.post('/api/activities', async function (req, res) {
  let data = req.body;
  uri = process.env.MANGO_DB_CONNECTION_STRING;

  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const activities = database.collection('activities');
    await activities.insertOne(data);
    res.sendStatus(200);
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
  console.log("ID", id);
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

// start listening
app.listen(port, function () {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + port);
});

