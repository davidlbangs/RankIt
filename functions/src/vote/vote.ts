import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

import * as stv from '../stv.js';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// interface ballotCounter {
//   [key:string]: number;
// }

// export const calcResults = function stv(foreignWinners: number, foreignBallots: string[][]) { 
  
//   let winners = foreignWinners;
//   let ballots = foreignBallots;

//   // helper objects
//   const name2totals: ballotCounter = {};
//   const name2ballots = {};
//   const name2weights = {};

//   // results arrays
//   const rounds = [];
//   const elected = [];

//   // THRESHOLD
//   // Threshold is the number of votes that mathematically guarantees that the candidate cannot lose
//   // Ex: 327 ballots / (2 winners + 1) = 109 + 1 = 110.
//   // In a 2 winner race with 327 ballots, a candidate with 110 votes is guaranteed victory.
//   const threshold = Math.floor(ballots.length/(winners+1))+1;

//   // Factor
//   // 
//   let factor = 1;
//   let elim: string;
//   let cans;

//   // do...while the winner count is less than the "can win" count.
//   do {
    
//     // ITERATE OVER EACH BALLOT
//     ballots.forEach(function(ballot, i) {
//       while (ballot.length) {
        
//         // grab the name of the vote and remove from the ballot array.
//         const name:string | undefined = ballot.shift(); 

//         // if it's the first round, everyone gets through.
//         // otherwise, we check to see if name is in name2totals
//         if (rounds.length === 0 || name in name2totals) {

//           // Significant change. this could be a bug.
//           // const new_weight:number = rounds.length === 0 || (name2weights[elim][i] * factor);
//           const new_weight:number = rounds.length === 0 ? 0 : (name2weights[elim][i] * factor);
//           name2ballots[name] = (name2ballots[name] || []);
//           name2ballots[name].push(ballot);
//           name2weights[name] = (name2weights[name] || []);
//           name2weights[name].push(new_weight);
//           name2totals[name] = (name2totals[name] || 0) + new_weight;

//           break;
//         }
//       }
//     });


//     rounds.push({...name2totals});
//     const mx = Math.max(...Object.values(name2totals));
//     if (threshold <= mx) {
//       winners--;
//       elim = Object.entries(name2totals).filter(x=>x[1]===mx)[0][0];
//       elected.push(elim);
//       factor = (mx-threshold)/mx;
//     } else {
//       const mn = Math.min(...Object.values(name2totals));
//       const mn_keys = Object.entries(name2totals).filter(x=>x[1]===mn).map(x=>x[0]);

//       const key:number = mn_keys.length * Math.random();
//       elim = mn_keys[key];
//       factor = 1;
//     }
//     ballots = name2ballots[elim]; /* Changing the Reference */
//     delete name2totals[elim];

//     //  Cans
//     // counts the number of potential winners who remain
//     cans = Object.keys(name2totals).length;
//     console.log(cans, name2totals);

//   } while (winners < cans && winners > 0);

//   if (winners !== 0) {
//     Object.keys(name2totals).forEach(x=>elected.push(x));
//   }   
//   return {"elected": elected, "rounds": rounds, "threshold": threshold};
// } 


function calculateResults(winners, ballots) {
  console.log('calculate results with...', winners, ballots);
}


export const syncPoll = functions.firestore
  .document('polls/{pollID}/votes/{voteID}')
  .onCreate((snap, context) => {

    // const tenetID = context.params.tenetID;
    const pollID = context.params.pollID;
    // const voteID = context.params.voteID;
    const db = admin.firestore();
    const pollRef = db.collection('polls').doc(pollID);
    const votesRef = pollRef.collection('votes');

    // get results
    const results = votesRef.get()
      .then(snapshot => snapshot.data())
      .then(votes => {
        calculateResults(1, votes);
      })
      .catch(err => console.log(err))



    return pollRef
      .update({'vote_count': admin.firestore.FieldValue.increment(1)})
      .then(() => console.log('updated poll!', pollID))
      .catch((err:any) => console.log(err));

  });
