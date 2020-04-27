import { Injectable } from '@angular/core';

import { Poll, Vote, Choice, Results } from '../models/poll.interface';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor() { }

  pollSummaryStatement(results:Results, winner_count:number, total_votes:number) {
    const total_rounds = results.rounds.length;
    const wins = (winner_count > 1) ? 'win' : 'wins';
    const rounds = (total_rounds > 1) ? 'rounds' : 'round';
    
    // We are shifting results so the 'last round' count is off in this context.
    const last_round = total_rounds -1;
    
    // hasTie checks to see if there is a tie in the final round.
    // it returns the round 
    const hasTie = this.hasTie(last_round, results);

    let electedString:string = this.candidateListString(results.elected);

    if(hasTie > 0) {
      return this.tieSummaryStatement(hasTie, results);
    }
    return `After ${total_rounds} ${rounds} and ${total_votes} votes, ${electedString} ${wins}.`;
  }

  tieSummaryStatement(winnerVoteCount:number, results:Results) {
    const total_rounds = results.rounds.length;
    const rounds = (total_rounds > 1) ? 'rounds' : 'round';

    let tieParticipants = this.getChoicesByVoteCount((total_rounds-1), results, winnerVoteCount);
    let tieString = this.candidateListString(tieParticipants); 

    let statement = `After ${total_rounds} ${rounds}, the poll resulted in a tie between ${tieString}.`;
    // console.log('CLS', tieString, statement/  );
    return statement;
  }


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
          // console.log('elected prev round', choice, round);
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
    * Gets the leader or loser
    *
    */
  getEdges(round:number, results:Results, edge:'max'|'min' = 'max') {
    const values = Object.values(results.rounds[round]);
    const logicalTest = (edge === 'max')? Math.max(...values) : Math.min(...values);
    const roundArr = Object.keys(results.rounds[round]);
    let selectedList: string[] = [];

    for(let choice of roundArr){
      if(results.rounds[round][choice] === logicalTest) {
        selectedList.push(choice);
      }
    }
    // we return the string and the count so we can detect if we need plural.
    return {string: this.candidateListString(selectedList), count: selectedList.length};
  } 

  /**
    * Returns an array of choices by vote count.
    *
    */

  getChoicesByVoteCount(round:number, results:Results, voteCount:number) {
    const roundArray = Object.entries(results.rounds[round]);
    let tieChoices = [];
    for(const [choice, choiceCount] of roundArray) {
      if(choiceCount == voteCount) {
        tieChoices.push(choice);
      }
    }
    return tieChoices;
  }

  /**
    * Determines if there's a tie.
    * If there is, it returns the count of votes that resulted in the tie.
    */
  hasTie(round:number, results:Results) {
    // console.log('test', round, results);
    if(results) {
      const lastRound = results.rounds[round];
      const counts = Object.values(lastRound);
      const max = Math.max(...counts);
      const countOfMax = counts.filter(function(x){ return x === max; }).length
      return (countOfMax > 1) ? max : 0;
    } else {
      return 0;
    }

    return 0;

  } 


  isLastRound(round:number, results:Results) {
    return (results.rounds.length - 1) === round || round === 0;
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
