import * as functions from 'firebase-functions';
const admin = require('firebase-admin');


// SEO IMPORTS
// const express = require('express');
// const localFetch = require('node-fetch');
// const url = require('url');
// const app = express();
// const appUrl = 'https://rankit-vote.firebaseapp.com';
// const renderUrl = 'https://rankit-rendertron.appspot.com';


import * as poll from './poll/poll';
import * as vote from './vote/vote';


// required to initialize
admin.initializeApp(functions.config().firebase);


export const syncPoll = vote.syncPoll;

export const closePoll = poll.closePolls;

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hola... from Firebase!");
});