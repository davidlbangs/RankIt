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
  @Input() summary: boolean;
  @Input() all_choices: Choice[];
  @Input() total_rounds: number;
  @Input() total_votes: number;
  @Input() display_count:boolean;

  get rounds() { return this.results.rounds; }
  get elected() { return this.results.elected; }
  get winning_percentage() { return 1 / (this.winner_count + 1); }
  get threshold() { return this.results.threshold; }

  constructor(
              private resultsService: ResultsService) { }

  ngOnInit() {
    if (this.summary) {
      this.round = this.results.rounds.length-1;
    }
  }

  get sortedChoices() {
    let round = this.round;

    let sorted = this.all_choices;

    // hardcoding to round 1, to avoid resorting after they start going through results.
    let choicesWithVotes = this.results.rounds[1];

    // if we start at round 0, it's weird.
    if(round == 0 ) { round = 1;}
    

    // move items that got zero votes to the bottom
    for(let x of sorted) {
      if(!(x in choicesWithVotes)){
        sorted.push(sorted.splice(sorted.indexOf(x), 1)[0]);
      }
    }
    
    sorted = this.all_choices.sort((a, b) => (choicesWithVotes[a] > choicesWithVotes[b]) ? -1 : 1);

    // console.log('running sort', sorted, this.results.rounds[1], this.all_choices);
    return sorted;

  }

  //
  // * IF It's the last round, we may need to round up
  // So we skip doing the math.
  // However, if it's not the last round, we'll do the math.
  declareWinner(round:number, choice:string) {
    if(round == this.total_rounds || round == 0) {
      return this.results.elected.includes(choice);
    } else {
      return this.getPercentage(round, choice) >= this.winning_percentage;
    }
  }

  getExhaustedVoteCount(round:number){
    return this.resultsService.getExhaustedVoteCount(round, this.results, this.total_votes);
  }

  getExhaustedVotePercentage(round:number){
    return this.resultsService.getExhaustedVotePercentage(round, this.results, this.total_votes);
  }

  getPercentage(round: number, choice:Choice) {
    return this.resultsService.getPercentage(round, 
                                             choice, 
                                             this.results, 
                                             this.rounds, 
                                             this.winner_count, 
                                             this.winning_percentage, 
                                             this.threshold,
                                             this.total_votes);
  }

  getCount(round: number, choice:Choice) {
    return this.resultsService.getCount(round, 
                                             choice, 
                                             this.results);
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
