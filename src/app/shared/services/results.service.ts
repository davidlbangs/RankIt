import { Injectable } from '@angular/core';

import { Poll, Vote, Choice, Results } from '../models/poll.interface';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor() { }

  pollSummaryStatement(results:Results, winner_count:number, total_votes:number) {
    const total_rounds = results.rounds.length;
    //console.log("rounds: ", total_rounds);
    const wins = (winner_count > 1) ? 'win' : 'wins';
    const rounds = (total_rounds > 1) ? 'rounds' : 'round';
    
    // We are shifting results so the 'last round' count is off in this context.
    const last_round = total_rounds -1;
    
    // hasTie checks to see if there is a tie in the final round.
    // it returns the round 
    const hasTie = this.hasTie(last_round, results);
    let ar:any[] = results.elected;
    if (results.elected.length > 0 && results.elected[0].name) {
      ar = results.elected.map(x=>x.name);
    }
    
    let electedString:string = this.candidateListString(ar);
    if(hasTie > 0 && winner_count > 0) {
      let ar2:any[] = [];
      for (const r of Object.keys(results.rounds[last_round])) {
        if (results.rounds[last_round][r] == hasTie) {
          ar2.push(r);
        }
      }
      var winners = [];
      for (const f of ar) {
        var found = false;
        for (const d of ar2) {
          if (d == f) {
            found = true;
          }
        }
        if (found == false) {
          winners.push(f);
        }
      }
      let electedString2:string = this.candidateListString(winners);
      return this.tieSummaryStatementWithWinners(hasTie, results, `${electedString2}`);
    }
    if(hasTie > 0) {
      return this.tieSummaryStatement(hasTie, results);
    }
    let vString = "votes";
    if (total_votes==1) {
      vString = "vote";
    }
    return `After ${total_rounds} ${rounds} and ${total_votes} ${vString}, ${electedString} ${wins}.`;
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
  tieSummaryStatementWithWinners(winnerVoteCount:number, results:Results, winner) {
    const total_rounds = results.rounds.length;
    const rounds = (total_rounds > 1) ? 'rounds' : 'round';

    let tieParticipants = this.getChoicesByVoteCount((total_rounds-1), results, winnerVoteCount);
    let tieString = this.candidateListString(tieParticipants);

    let statement = `After ${total_rounds} ${rounds} ${winner} won and there was a tie between ${tieString}.`;
    // console.log('CLS', tieString, statement/  );
    return statement;
  }

  /* NEW from Stephen, 7/20*/

  getCount(round:number, choice:string, results: Results, rounds:any, winner_count, threshold) {

    if(winner_count === 1) {
      return results.rounds[round][choice];
    }

    let ar:any[] = results.elected;
    if (results.elected.length > 0 && results.elected[0].round) {
      ar = results.elected.map(x=>x.name);
    }
    // if the choice is elected in a previous round
    // that choice gets the threshold.
    if(
       ar.includes(choice) && 
       !rounds[round][choice]
       ) {
          return threshold;
    } else {
      return results.rounds[round][choice];
    }
  }

  getExhaustedVoteCount(round:number, results:Results, total_votes, winner_count, threshold, electedList, rounds) {
    let voteAdjustment = 0;
    let current_votes:number = this.countVotes(results.rounds[round]);

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
      voteAdjustment = pastWinners * threshold;
    }
    let r = total_votes - (current_votes+voteAdjustment);
//    console.log("votal votes: ", total_votes, current_votes, voteAdjustment);
    if (r < 0) {
      r = 0;
    }
    return r;
  }
  getExhaustedVotePercentage(round:number, results:Results, total_votes, winner_count, threshold, electedList, rounds) {
    let exhaustedVoteCount = this.getExhaustedVoteCount(round, results, total_votes, winner_count, threshold, electedList, rounds);

    return (exhaustedVoteCount/total_votes);
  }

  countVotes(roundObj: {[key:string]:number}){
    if (roundObj == null) {
        return 0;
    }
    return Object.values(roundObj).reduce((t, n) => t + n);
  }


  /* END NEW */


  getPercentage(round: number, choice: string, results: Results, rounds:any, winner_count:number, winning_percentage: number, threshold:number, total_votes:number) {
    if(winner_count === 1) {
      return this.calculatePercentage(round, choice, results, total_votes, winner_count, rounds, threshold);
    }


    let ar:any[] = results.elected;
    if (results.elected.length > 0 && results.elected[0].round) {
      ar = results.elected.map(x=>x.name);
    }

    // if the choice is elected in a previous round
    // that choice gets the threshold.
    if(
       ar.includes(choice) && 
       !rounds[round][choice]
       ) {
          // console.log('elected prev round', choice, round);
          return winning_percentage;
    }

    // not a special case.
    return this.calculatePercentage(round, choice, results, total_votes, winner_count, rounds, threshold);
  }

  private calculatePercentage(round:number, choice:string, results:Results, total_votes:number, winner_count, rounds, threshold) {
    let numerator = results.rounds[round][choice];
    let denominator = this.getTotalVotes(round, winner_count, results.elected.map(a => a.name), rounds, threshold);
    // let denominator = total_votes;
    return (numerator / denominator) || 0;
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
    return (results.rounds.length - 1) === round; //  || round === 0;
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
