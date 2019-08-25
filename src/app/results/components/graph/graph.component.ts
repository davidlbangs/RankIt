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
      return 101;
    } else {
      return width;
    }
  }

  

}
