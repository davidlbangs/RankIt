import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Poll, Results, Choice } from '../../../shared/models/poll.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'results-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  objectKeys = Object.keys;
  @Input() results: Results;
  @Input() winner_count: number;
  @Input() round: number;
  @Input() all_choices: Choice[];
  @Input() total_rounds: number;

  get rounds() { return this.results.rounds; }
  get elected() { return this.results.elected; }
  get winning_percentage() { return 1 / (this.winner_count + 1); }
  get threshold() { return this.results.threshold; }

  constructor() { }

  ngOnInit() {
    console.log('LOADING', this.results, this.rounds[this.round]);
  }

  getPercentage(round: number, choice: string) {
    if(this.winner_count === 1) {
      return this.calculatePercentage(round, choice);
    }

    // if the choice is elected in a previous round
    // that choice gets the threshold.
    if(
       this.results.elected.includes(choice) && 
       !this.rounds[round][choice]
       ) {
          console.log('elected prev round', choice, round);
          return this.winning_percentage;
    }

    // not a special case.
    return this.calculatePercentage(round, choice);
  }

  

  calculatePercentage(round:number, choice:string) {
    return (this.rounds[round][choice] / this.getTotalVotes(round)) || 0;
  }

  /**
    * Sum up all the votes in this round
    */
  getTotalVotes(round: number) {
    let voteAdjustment = 0;

    // if there are already winners, 
    // we need to incorporate those votes back into the count.
    if(this.winner_count > 1) {
      let pastWinners:number = 0;

      // For all elected
      // if they're in the round still, don't adjust for their votes
      // if they're not in the round, adjust for their votes.
      for(let elected of this.elected){
        if(!this.rounds[round][elected]) {
          pastWinners++;
        }
      }
      // let totalChoices = this.all_choices.length;
      // let currentChoices = Object.keys(this.rounds[round]).length;
      voteAdjustment = pastWinners * this.threshold;
    }
    console.log('adjusting vote', voteAdjustment);

    return this.sum(this.rounds[round]) + voteAdjustment;
  }

  getWidth(percentage:number) {
    let width = percentage/this.winning_percentage * 100;
    if(width >= 101){
      return 101;
    } else {
      return width;
    }
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
