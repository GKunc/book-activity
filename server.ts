/* eslint-disable @typescript-eslint/no-var-requires */
import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join, resolve } from 'path';

import { AppServerModule } from './src/main.server';
import 'localstorage-polyfill';
global.localStorage; // now has your in memory localStorage

import { MongoClient, GridFSBucket } from 'mongodb';
import * as uploadFilesMiddleware from './upload';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

const db = require('./server/models');
const initializeDb = require('./server/setup/initializeDb');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.use(express.json());
  server.use(cors({}));
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
  const distFolder = join(process.cwd(), 'dist/book-activity/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.get('/service-worker.js', (req, res) => {
    res.sendFile(resolve(__dirname, 'public', 'service-worker.js'));
  });

  // routes
  require('./server/routes/auth.routes')(server);
  require('./server/routes/activity.routes')(server);
  require('./server/routes/favourite.routes')(server);
  require('./server/routes/comment.routes')(server);
  require('./server/routes/mail.routes')(server);

  db.mongoose
    .connect(`${process.env['MANGO_DB_CONNECTION_STRING_PHOTOS']}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connect to MongoDB.');
      initializeDb();
    })
    .catch((err) => {
      console.error('Connection error', err);
      process.exit();
    });

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  // ========================================================
  // ========================================================
  // ========================================================
  server.get('/api/activities/check-permissions', async function (req, res) {
    const uri = process.env['MANGO_DB_CONNECTION_STRING'];
    const query = {};
    const guid = req.query['guid'];
    const userId = req.query['userId'];

    if (guid) {
      query['guid'] = req.query['guid'];
    }

    const client = new MongoClient(uri);
    try {
      const database = client.db('edds');
      const activities = database.collection('activities');
      const result = await activities.findOne(query);
      if (result['createdBy'] === userId) {
        console.log('Permission granted.');
        return res.status(200).send('OK');
      } else {
        console.log('No permission.');
        return res.status(401).json({ error: 'No permission' });
      }
    } finally {
      await client.close();
    }
  });

  server.post('/api/activities/photos', async function (req, res) {
    try {
      await uploadFilesMiddleware(req, res);

      if (req['file'] == undefined) {
        return res.send({
          message: 'You must select a file.',
        });
      }

      return res.send({
        message: 'File has been uploaded.',
      });
    } catch (error) {
      console.log(error);

      return res.send({
        message: 'Error when trying upload image: ${error}',
      });
    }
  });

  server.get('/api/activities/photos', function (req, res) {
    const id = req.query['id'];
    const uri = process.env['MANGO_DB_CONNECTION_STRING'];
    const client = new MongoClient(uri);
    try {
      const database = client.db('edds');
      const bucket = new GridFSBucket(database, {
        bucketName: 'photos',
      });

      const downloadStream = bucket.openDownloadStreamByName(id as string);

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
      console.log(error);
      return res.status(500).send({
        message: error.message,
      });
    }
  });

  server.delete('/api/activities/photos', async function (req, res) {
    const id = req.query['id'];
    const uri = process.env['MANGO_DB_CONNECTION_STRING'];
    const client = new MongoClient(uri);
    try {
      const database = client.db('edds');
      const bucket = new GridFSBucket(database, {
        bucketName: 'photos',
      });

      const image = bucket.find({ filename: id });
      image.forEach((doc) => {
        bucket.delete(doc._id);
      });

      return res.status(200);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: error.message,
      });
    }
  });

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
