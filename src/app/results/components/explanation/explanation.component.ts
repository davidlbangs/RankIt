import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Poll, Results, Choice } from '../../../shared/models/poll.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'results-explanation',
  styleUrls: ['./explanation.component.scss'],
  template: `
     
      
      <div *ngIf="isSummary">
        <p class="mb-2">After {{ total_rounds }} {{ (total_rounds > 1) ? 'rounds' : 'round'}}, <strong>{{results.elected[0]}}</strong> wins. More coming soon.</p>
        <p>Ranked Choice Voting (RCV) is different from choose-only-one voting. Voters get to rank candidates in order of choice. If a candidate receives more than half of the first choices, they win, just like any other election. If not, the candidate with the fewest votes is eliminated, and voters who picked that candidate as ‘number 1’ will have their votes count for their next choice. This process continues until a candidate wins with more than half of the votes.</p>
      </div>

      <div *ngIf="isWinningRound">
        We have a winner!
      </div>
     
  `
})
export class ExplanationComponent implements OnInit {
  @Input() results: Results;
  @Input() winner_count: number;
  @Input() round: number;
  @Input() all_choices: Choice[];
  @Input() total_rounds: number;
  @Input() total_votes: number;

  constructor() { }

  ngOnInit() {
  }

  get isSummary() { return (this.round === 0 );}
  get isWinningRound() { return (this.round === this.total_rounds);}

}
