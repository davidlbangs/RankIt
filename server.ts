// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

//import { createWindowMocks } from '@trilon/ng-universal';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

// Polyfills required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// Faster renders in prod mode
enableProdMode();

// Export our express server
export const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist/browser');
const APP_NAME = 'rankit'; // TODO: replace me!

// was ${APP_NAME}-server
const { AppServerModule, LAZY_MODULE_MAP } = require(`./dist/server/main`);

// index.html template
// const template = readFileSync(join(DIST_FOLDER, APP_NAME, 'index.html')).toString();
const domino = require('domino');
const fs = require('fs');
const path = require('path');
// const template = fs.readFileSync(path.join(__dirname, '.', 'dist', 'index.html')).toString();
const template = fs.readFileSync(path.join(__dirname, join(DIST_FOLDER, '/index.html'))).toString();

//createWindowMocks(template);

// const win = domino.createWindow(template);
// global['window'] = win;
// global['document'] = win.document;

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
// app.set('views', join(DIST_FOLDER, APP_NAME));
app.set('views', DIST_FOLDER);

// Serve static files 
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

app.use(require('prerender-node').set('prerenderToken', 'Dmq9oEPFIqRzSjxKGFhf'));

// All regular routes use the Universal engine
// was DIST_FOLDER, APP_NAME
// res.render(join(DIST_FOLDER, APP_NAME + '-webpack', 'index.html'), { req });
app.get('*', (req, res) => {
     res.render('index', { req });
});

// If we're not in the Cloud Functions environment, spin up a Node server
if (!process.env.FUNCTION_NAME) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
  });
}