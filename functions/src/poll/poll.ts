import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
// const db = admin.firestore();
const promisePool = require('es6-promise-pool');
// const PromisePool = promisePool.PromisePool;
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;

import { Poll } from '../../../src/app/shared/models/poll.interface';

// was exports.
export const closePolls = functions.pubsub.schedule('every 30 minutes').onRun(async context => {
  // Fetch all polls.
  const expiredPolls = getExpiredPolls();
  // Use a pool so that we close maximum `MAX_CONCURRENT` polls in parallel.
  const pool = new promisePool.PromisePool(() => closePoll(expiredPolls), MAX_CONCURRENT);
  await pool.start();
  console.log('Poll cleanup finished');
});


/* Closes a single poll */
function closePoll(expiredPolls:Poll[]){
  if(expiredPolls.length > 0 ) {
    const pollToClose = expiredPolls.pop();

    // Delete the inactive user.
    const db = admin.firestore();

    // update the relevant poll
    const pollRef = db.collection('polls').doc(pollToClose.id);

    return pollRef
      .update({'is_open': false})
      .then(() => console.log('Closed poll ', pollToClose.id, ' because it expired.'))
      .catch((err:any) => console.log(err));
  } else {
    return null;
  }
}



/* Returns the list of all expired polls. */
function getExpiredPolls() {
  var pollsRef = admin.firestore().collection('polls');

  const expiredPolls = pollsRef.where('keep_open', '==', 'true').where('length.end_time', '<', Date.now());


  // const allPolls:Poll[] = await admin.firestore().collection('polls');
  // const expiredPolls = allPolls.filter(
  //     poll => !poll.keep_open && (Date.now() > poll.length.end_time));
  
  return expiredPolls;
}
