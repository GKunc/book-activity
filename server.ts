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

import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';

const db = require('./src/server/models');
const initializeDb = require('./src/server/setup/initializeDb');
const initializeDevDb = require('./src/server/setup/initializeDevDb');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.use((req, res, next) => {
    if (req.originalUrl === '/api/payment/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  server.use(cors({}));
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser());
  server.use(compression());
  const distFolder = join(process.cwd(), 'dist/book-activity/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.get('/service-worker.js', (req, res) => {
    res.sendFile(resolve(__dirname, 'public', 'service-worker.js'));
  });

  // routes
  require('./src/server/routes/photo.routes')(server);
  require('./src/server/routes/auth.routes')(server);
  require('./src/server/routes/activity.routes')(server);
  require('./src/server/routes/favourite.routes')(server);
  require('./src/server/routes/comment.routes')(server);
  require('./src/server/routes/mail.routes')(server);
  require('./src/server/routes/payments.routes')(server);

  db.mongoose
    .connect(`${process.env['MANGO_DB_CONNECTION_STRING_PHOTOS']}`)
    .then(() => {
      console.log('Successfully connected to MongoDB.', process.env['MANGO_DB_CONNECTION_STRING_PHOTOS']);
      console.log('Production:', process.env['production']);
      if (Boolean(process.env['production']) === true) {
        initializeDb();
      } else {
        initializeDevDb();
      }
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
