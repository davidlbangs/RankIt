import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

// required to initialize
admin.initializeApp(functions.config().firebase);

// const express = require('express');
// const app = express();
// const cors = require('cors');

// SEO IMPORTS
// const express = require('express');
// const localFetch = require('node-fetch');
// const url = require('url');
// const app = express();
// const appUrl = 'https://rankit-vote.firebaseapp.com';
// const renderUrl = 'https://rankit-rendertron.appspot.com';


import * as poll from './poll/poll';
import * as vote from './vote/vote';
import * as users from './user/user';
import * as captcha from './captcha/captcha';
import * as visualize from './visualize/visualize';
import * as resyncA from './resync/resync';

export const importUser = users.importUser;
export const syncPoll = vote.syncPoll;

export const closePoll = poll.closePolls;
export const checkRecaptcha = captcha.checkRecaptcha;
export const visualizeF = visualize.visualize;
export const resync = resyncA.resync


export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hola:( from Firebase!");
});

// export const corsServer = express();
// corsServer.use(cors({origin: true}));
// corsServer.get('*', (request, response) => {
//   response.send('Hello from Express on Firebase with CORS!');
// });


// export const prerender = app.use(require('prerender-node').set('prerenderToken', 'Dmq9oEPFIqRzSjxKGFhf'));
