import * as functions from 'firebase-functions';
const admin = require('firebase-admin');


// SEO IMPORTS
const express = require('express');
const localFetch = require('node-fetch');
const url = require('url');
const app = express();
const appUrl = 'https://rankit-vote.firebaseapp.com';
const renderUrl = 'https://rankit-rendertron.appspot.com';


import * as poll from './poll/poll';
import * as vote from './vote/vote';


// required to initialize
admin.initializeApp(functions.config().firebase);


export const syncPoll = vote.syncPoll;

export const closePoll = poll.closePolls;

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hola... from Firebase!");
});



/*
 * SEO 
 */


// Generates the URL 
function generateUrl(request) {
  return url.format({
    protocol: request.protocol,
    host: appUrl, 
    pathname: request.originalUrl
  });
}

function detectBot(userAgent) {
  // List of bots to target, add more if you'd like

  const bots = [
    // crawler bots
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    // link bots
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'embedly',
    'baiduspider',
    'pinterest',
    'slackbot',
    'vkShare',
    'facebot',
    'outbrain',
    'W3C_Validator'
  ]

  const agent = userAgent.toLowerCase()

  for (const bot of bots) {
    if (agent.indexOf(bot) > -1) {
      console.log('bot detected', bot, agent)
      return true
    }
  }

  console.log('no bots found')
  return false

}


app.get('*', (req, res) => {


  const isBot = detectBot(req.headers['user-agent']);

  
  if (isBot) {

    const botUrl = generateUrl(req);
    // If Bot, localFetch url via rendertron

    localFetch(`${renderUrl}/${botUrl}`)
      .then(result => result.text() )
      .then(body => {

        // Set the Vary header to cache the user agent, based on code from:
        // https://github.com/justinribeiro/pwa-firebase-functions-botrender
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.set('Vary', 'User-Agent');
        
        res.send(body.toString())
      
    });

  } else {

    
    // Not a bot, localFetch the regular Angular app
    // Possibly faster to serve directly from from the functions directory? 
    localFetch(`https://${appUrl}`)
      .then(result => result.text())
      .then(body => {
        res.send(body.toString());
      })
  }
  
});

exports.app = functions.https.onRequest(app);
