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


  constructor() { }

  ngOnInit() {
    console.log('here', this.results, this.round);
  }

  get rounds() {
    return this.results.rounds;
  }

  get winning_percentage() {
    return 1 / (this.winner_count + 1);
  }

  getPercentage(round: number, choice: string) {
    const percentage = (this.rounds[round][choice] / this.getTotalVotes(round)) || 0;
    return percentage;
  }

  /**
    * Sum up all the votes in this round
    */
  getTotalVotes(round: number) {
    return this.sum(this.rounds[round]);
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
    * Add all the values in an object.
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
