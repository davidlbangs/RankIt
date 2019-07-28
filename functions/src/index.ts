import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

import * as vote from './vote/vote';

// required to initialize
admin.initializeApp(functions.config().firebase);


export const syncPoll = vote.syncPoll;

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
