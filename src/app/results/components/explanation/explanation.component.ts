import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Poll, Results, Choice } from '../../../shared/models/poll.interface';
import { ResultsService } from '../../../shared/services/results.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'results-explanation',
  styleUrls: ['./explanation.component.scss'],
  template: `
    <div *ngIf="results">
      <div *ngIf="isPollSummary(round); else RoundSummary">
        <p class="mb-2">{{ pollSummaryStatement()}}</p>
        <p *ngIf="!isMultiWinner" class="mb-2">All ballots are counted in each round and your vote goes to the candidate you ranked highest (among those candidates still in the running).</p>

        <p *ngIf="isMultiWinner" class="mb-2">In a multi-winner ranked choice voting poll with {{winner_count}} winners, each winner must get at least {{ 1 / (winner_count + 1) | percent }} of the vote or be the last {{label}} standing. The percentage of votes required (threshold) depends on how many seats are being elected - the more seats there are to fill, the lower the percentage needed to win.</p>
        <p *ngIf="isMultiWinner">Voters rank candidates in order of choice. If no candidate meets the percentage of votes needed to win, the candidate with the lowest number of votes is eliminated and voters who picked that candidate will have their votes count for their next choice. If a candidate does meet the percentage of votes needed, any extra votes count proportionally toward voters’ next choices.</p>
      </div>

      <ng-template #RoundSummary>
        <p class="mb-2" *ngIf="roundHasWinner(round)">
          {{ winnerSummaryStatement(round)}}
        </p>

        <p class="mb-2" *ngIf="roundHasWinner(round) && winner_count > 1">
          {{ multiWinnerReductionStatement(round) }}
        </p>

        <p class="mb-2" *ngIf="!roundHasWinner(round)">
          {{noWinnerSummaryStatement(round)}}
        </p>
      </ng-template>
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
  @Input() label:string = 'choice';

  get rounds() { return this.results.rounds; }
  get elected() { return this.results.elected; }
  get winning_percentage() { return 1 / (this.winner_count + 1); }
  get threshold() { return this.results.threshold; }
  get isMultiWinner() { return (this.winner_count > 1) ? true : false; }
  get isWinningRound() { return (this.round === this.total_rounds);}
  constructor(private resultsService: ResultsService) { }

  ngOnInit() {

    console.log('results', this.results);
  }

  isPollSummary(round) { return this.isLastRound(round);}
  

  roundHasWinner(round) {
    round = round - 1;
    console.log("rounds: ", this.rounds, round);
    const values = Object.values(this.rounds[round]);
    const largest = Math.max(...values);
    // console.log(round, largest, this.results.threshold);
    return (largest >= this.results.threshold) ? largest : 0;
  }

  getWinners(round) {
    let winners = {};
    for(let choice of this.all_choices){
      let pct = this.resultsService.getPercentage((round-1), 
                                             choice, 
                                             this.results, 
                                             this.rounds, 
                                             this.winner_count, 
                                             this.winning_percentage, 
                                             this.threshold);
      if(pct > this.winning_percentage) {
        winners[choice] = pct;
      }
    }
    // console.log(winners);
    return winners;
  }

  winnerSummaryStatement(round) {
    const winners = this.getWinners(round);
    const winnerArray = Object.keys(winners);
    const pctNumArray:number[] = Object.values(winners);
    const pctStrArray:string[] = pctNumArray.map((x:number) => this.percentToString(x));

    // language
    const aWinner = (winnerArray.length > 1) ? 'multiple winners this round' : 'a winner';
    const winnerString = this.resultsService.candidateListString(winnerArray);
    const wins = (winnerArray.length > 1) ? 'win' : 'wins';
    const pctString = this.resultsService.candidateListString(pctStrArray);
    const respectively = (winnerArray.length > 1) ? ', respectively' : '';

    return `We have ${aWinner}! ${winnerString} ${wins} with ${pctString} of the vote${respectively}.`;
  }

  noWinnerSummaryStatement(round) {
    const winners = this.getWinners(round);
    // console.log('winners', winners);

    const leaders = this.getLeaders(round);
    const losers = this.getLosers(round);

    // language
    const isLeading = (leaders.count > 1) ? 'are leading': 'is leading';
    const losingCandidate = (losers.count > 1) ? this.label + 's' : this.label;
    const oneAtaTime = (losers.count > 1) ? ' one at a time' : '';
    const remaining = (this.winner_count > 1) ? 'remaining ' : '';

    return `${leaders.string} ${isLeading} but no ${remaining}${this.label} has over ${this.percentToString(this.winning_percentage)} of the votes. So, the ${losingCandidate} with the fewest votes, ${losers.string}, will be eliminated${oneAtaTime}. Voters who chose ${losers.string} will have their votes redistributed to the remaining ${this.label}s based on their next preferences.`;
  }

  pollSummaryStatement() {
    console.log("round audi: ", this.results.rounds);
    return this.resultsService.pollSummaryStatement(this.results, this.winner_count, this.total_votes);
  }

  multiWinnerReductionStatement(round) {
    const winners = this.getWinners(round);
    const winnerArray = Object.keys(winners);
    const winnerString = this.resultsService.candidateListString(winnerArray);
    return `${winnerString}’s votes in excess of the threshold will be redistributed to the remaining ${this.label}s based on ${winnerString}’s voter’s next preferences. `;
  }

  roundSummaryStatement() {

  }

  getLeaders(round) {
    return this.resultsService.getEdges((round-1), this.results, 'max');
  }

  getLosers(round) {
    return this.resultsService.getEdges((round-1), this.results, 'min');
  }

  isLastRound(round) {
    return this.resultsService.isLastRound((round-1), this.results);
  }


  percentToString(num:number) {
    return (num*100).toFixed(0)+"%";
  }



}
