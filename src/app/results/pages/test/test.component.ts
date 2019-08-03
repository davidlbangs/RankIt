import { Component, OnInit } from '@angular/core';

// import * as stv from 'stv';
declare function stv(winners, ballots): any;

interface ballotCounter {
  [key:string]: any; // should be number | true
}

// interface Ballot {
//   Array<{
//     Array<{ string: number}>
//   }>
// }

interface name2ballotType {
  [key:string]: Array<{
     [key: number]: string[]
   }>
}


@Component({
  selector: 'app-test',
  styleUrls: ['./test.component.scss'],
  template:`

    <header>
      <h1>Test Bed</h1>
    </header>

    <main>
    <div *ngIf="results">
      <div>
        Winners: <span *ngFor="let elected of results.elected">{{elected}}</span>
      </div>
      <div *ngFor="let round of results.rounds">
        
      </div>
    </div>
    {{results | json }}
    </main>

  `
})
export class TestComponent implements OnInit {

  results: any;

  runVotes(winners, ballots) {
    return stv(winners, ballots);
  }

  //  {{ stv(1, ballots) | json }}
  constructor() { }

  ngOnInit() {
    this.results = this.runVotes(2, this.ballots);
    // testMethod();
  }


  // newBall


  ballots: string[][] = [
    ["JOHN ERWIN","TOM NORDYKE","ANNIE YOUNG"],
    ["MEG FORNEY"],
    ["JOHN ERWIN","MARY LYNN MCPHERSON","MEG FORNEY"],
    ["STEVE BARLAND","MEG FORNEY","CASPER HILL"],
    ["ANNIE YOUNG","MEG FORNEY","JASON STONE"],
    ["MARY LYNN MCPHERSON","MEG FORNEY","ANNIE YOUNG"],
    ["JOHN ERWIN","JASON STONE"],
    ["JOHN ERWIN","ANNIE YOUNG","TOM NORDYKE"],
    ["HASHIM YONIS"],
    ["HASHIM YONIS"],
    ["TOM NORDYKE","JOHN ERWIN","JASON STONE"],
    ["MEG FORNEY","JOHN ERWIN","STEVE BARLAND"],
    ["JOHN ERWIN","JASON STONE","ANNIE YOUNG"],
    ["JOHN ERWIN","JASON STONE"],
    ["JOHN ERWIN","TOM NORDYKE"],
    ["ANNIE YOUNG","MEG FORNEY","CASPER HILL"],
    ["STEVE BARLAND","ISHMAEL ISRAEL","ANNIE YOUNG"],
    ["JOHN ERWIN","JOHN ERWIN","JASON STONE"],
    ["MEG FORNEY","STEVE BARLAND","MARY LYNN MCPHERSON"],
    ["ANNIE YOUNG"],
    ["STEVE BARLAND"],
    ["STEVE BARLAND"],
    ["STEVE BARLAND"],
    ["STEVE BARLAND"],
    ["MEG FORNEY","ANNIE YOUNG","MARY LYNN MCPHERSON"]
];


//   stv(foreignWinners: number, foreignBallots: string[][]) { 
  
//   let winners = foreignWinners;
//   let ballots = foreignBallots;

//   // helper objects
//   const name2totals: ballotCounter = {};
//   const name2ballots: any = {};
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
//         console.log(ballots);
//         // grab the name of the vote and remove from the ballot array.
//         const name:string | undefined = ballot.shift(); 

//         // if it's the first round, everyone gets through.
//         // otherwise, we check to see if name is in name2totals
//         if (rounds.length === 0 || name in name2totals) {

//           // Significant change. this could be a bug.
//           const new_weight:number | true = rounds.length === 0 || (name2weights[elim][i] * factor);
//           // const new_weight:number | true = rounds.length === 0 ? true : (name2weights[elim][i] * factor);
//           name2ballots[name] = (name2ballots[name] || []);
//           name2ballots[name].push(ballot);
//           name2weights[name] = (name2weights[name] || []);
//           name2weights[name].push(new_weight);

//           if(new_weight !== true) {
//             name2totals[name] = (name2totals[name] || 0) + new_weight;
//           } else {
//             name2totals[name] = true;
//           }

//            // console.log('test', rounds.length, name2ballots, ballot);
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
//     // console.log(cans, name2totals);

//   } while (winners < cans && winners > 0);

//   if (winners !== 0) {
//     Object.keys(name2totals).forEach(x=>elected.push(x));
//   }   
//   return {"elected": elected, "rounds": rounds, "threshold": threshold};
// } 

}
