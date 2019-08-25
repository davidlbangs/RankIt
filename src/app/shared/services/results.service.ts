import { Injectable } from '@angular/core';

import { Poll, Vote, Choice, Results } from '../models/poll.interface';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor() { }


  getPercentage(round: number, choice: string, results: Results, rounds:any, winner_count:number, winning_percentage: number, threshold:number) {
    if(winner_count === 1) {
      return this.calculatePercentage(round, choice, results, rounds, winner_count, threshold);
    }

    // if the choice is elected in a previous round
    // that choice gets the threshold.
    if(
       results.elected.includes(choice) && 
       !rounds[round][choice]
       ) {
          console.log('elected prev round', choice, round);
          return winning_percentage;
    }

    // not a special case.
    return this.calculatePercentage(round, choice, results, rounds, winner_count, threshold);
  }

  calculatePercentage(round:number, choice:string, results:Results, rounds:any, winner_count, threshold) {
    return (rounds[round][choice] / this.getTotalVotes(round, winner_count, results.elected, rounds, threshold)) || 0;
  }

  /**
    * Sum up all the votes in this round
    */
  getTotalVotes(round: number, winner_count:number, electedList, rounds, threshold) {
    let voteAdjustment = 0;

    // if there are already winners, 
    // we need to incorporate those votes back into the count.
    if(winner_count > 1) {
      let pastWinners:number = 0;

      // For all elected
      // if they're in the round still, don't adjust for their votes
      // if they're not in the round, adjust for their votes.
      for(let elected of electedList){
        if(!rounds[round][elected]) {
          pastWinners++;
        }
      }
      // let totalChoices = this.all_choices.length;
      // let currentChoices = Object.keys(this.rounds[round]).length;
      voteAdjustment = pastWinners * threshold;
    }
    console.log('adjusting vote', voteAdjustment);

    return this.sum(rounds[round]) + voteAdjustment;
  }


  /**
    * Create Candidate List
    *  Returns "Andrew Yang", "Andrew Yang and Kamala Harris" or "Andrew Yang, Kamala Harris, and Bernie Sanders"
    */
  candidateListString(array:string[]) {
    let c:string = '';
    switch(array.length){
      case 1:
        c = array[0];
      break;
      case 2: 
        c = array[0] + ' and ' + array[1];
      break;
      default: 
        array.forEach(function(result, index, arr) {
          if(index < (arr.length - 1)) {
            c += result + ', ';
          } else {
            c += 'and ' + result
          }
        });
      break;
    }
    return c;
  }


  /**
    * Utility: Add all the values in an object.
    */
  sum( obj ) {
    let sum = 0;
    for( let el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseFloat( obj[el] );
      }
    }
    return sum;
  }


}
