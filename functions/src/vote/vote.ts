import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const syncPoll = functions.firestore
  .document('polls/{pollID}/votes/{voteID}')
  .onCreate((snap, context) => {

    // const tenetID = context.params.tenetID;
    const pollID = context.params.pollID;
    // const voteID = context.params.voteID;
    // const message = snap.data();
    const db = admin.firestore();

    // console.log('message', last_message);

    // update the relevant poll

    const pollRef = db.collection('polls').doc(pollID);


    return pollRef
      .update({'vote_count': admin.firestore.FieldValue.increment(1)})
      .then(() => console.log('updated poll!', pollID))
      .catch((err:any) => console.log(err))

  });