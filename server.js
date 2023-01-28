const express = require("express");
const { MongoClient } = require("mongodb");

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
app.use(express.static(app_folder, options));

// serve angular paths
app.get('/', function (req, res) {
  res.status(200).sendFile(`/`, { root: app_folder });
});

app.get('/activities', async function (req, res) {
  uri = "";

  const client = new MongoClient(uri);
  try {
    const database = client.db('edds');
    const movies = database.collection('activities');
    // Query for a movie that has the title 'Back to the Future'
    const query = { type: 'test' };
    const movie = await movies.findOne(query);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.send(JSON.stringify(movie));
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
})

// start listening
app.listen(port, function () {
  console.log("Node Express server for " + app.name + " listening on http://localhost:" + port);
});
