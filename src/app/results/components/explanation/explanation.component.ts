import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Poll, Results, Choice } from '../../../shared/models/poll.interface';
import { ResultsService } from '../../../shared/services/results.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'results-explanation',
  styleUrls: ['./explanation.component.scss'],
  template: `
    <div *ngIf="results">
      <div *ngIf="isPollSummary; else RoundSummary">
        <p class="mb-2">{{ pollSummaryStatement()}}</p>
        <p>Ranked Choice Voting (RCV) is different from choose-only-one voting. Voters get to rank candidates in order of choice. If a candidate receives more than half of the first choices, they win, just like any other election. If not, the candidate with the fewest votes is eliminated, and voters who picked that candidate as ‘number 1’ will have their votes count for their next choice. This process continues until a candidate wins with more than half of the votes.</p>
      </div>

      <ng-template #RoundSummary>
        <p class="mb-2">
          Hi.
        </p>
      </ng-template>

      <div *ngIf="isWinningRound">
        We have a winner!
      </div>
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

  get rounds() { return this.results.rounds; }
  get elected() { return this.results.elected; }
  get winning_percentage() { return 1 / (this.winner_count + 1); }
  get threshold() { return this.results.threshold; }

  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
    console.log('booting explanation', this.results);
  }

  get isPollSummary() { return (this.round === 0 );}
  get isWinningRound() { return (this.round === this.total_rounds);}


  pollSummaryStatement() {
    const wins = (this.winner_count > 1) ? 'win' : 'wins';
    const rounds = (this.total_rounds > 1) ? 'rounds' : 'round';
    let electedString:string = this.resultsService.candidateListString(this.results.elected);
    return `After ${this.total_rounds} ${rounds}, ${electedString} ${wins}.`;
  }

  roundSummaryStatement() {

  }

  getLeader(round) {

  }



}
