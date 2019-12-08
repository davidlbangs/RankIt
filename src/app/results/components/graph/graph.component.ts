import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Poll, Results, Choice } from '../../../shared/models/poll.interface';
import { ResultsService } from '../../../shared/services/results.service';

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

  constructor(
              private resultsService: ResultsService) { }

  ngOnInit() {
  }

  get sortedChoices() {
    let round = this.round;

    // if we start at round 0, it's weird.
    if(round == 0 ) { round = 1;}


    // presently hardcoding to round 1, to avoid resorting after they start going through results.
    const sorted = this.all_choices.sort((a, b) => (this.results.rounds[1][a] > this.results.rounds[1][b]) ? -1 : 1);

    // console.log('running sort', sorted, this.all_choices);
    return sorted;

  }

  //
  // * IF It's the last round, we may need to round up
  // So we skip doing the math.
  // However, if it's not the last round, we'll do the math.
  declareWinner(round:number, choice:string) {
    console.log('oh hey', round);
    if(round == this.total_rounds || round == 0) {
      return this.results.elected.includes(choice);
    } else {
      return this.getPercentage(round, choice) >= this.winning_percentage;
    }
  }

  getPercentage(round: number, choice:Choice) {
    return this.resultsService.getPercentage(round, 
                                             choice, 
                                             this.results, 
                                             this.rounds, 
                                             this.winner_count, 
                                             this.winning_percentage, 
                                             this.threshold);
  }
  

  getWidth(percentage:number) {
    let width = percentage/this.winning_percentage * 100;
    if(width >= 101){
      return 103;
    } else {
      return width;
    }
  }
  

}
