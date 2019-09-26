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
        <p>Ranked Choice Voting (RCV) is different from choose-only-one voting. Voters get to rank candidates in order of choice. If a candidate receives more than half of the first choices, they win, just like any other election. If not, the candidate with the fewest votes is eliminated, and voters who picked that candidate as ‘number 1’ will have their votes count for their next choice. This process continues until a candidate wins with more than half of the votes.</p>
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

  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
  }

  isPollSummary(round) { return this.isLastRound(round);}
  get isWinningRound() { return (this.round === this.total_rounds);}

  roundHasWinner(round) {
    const values = Object.values(this.rounds[round]);
    const largest = Math.max(...values);
    console.log(round, largest, this.results.threshold);
    return (largest >= this.results.threshold) ? largest : 0;
  }

  getWinners(round) {
    let winners = {};
    for(let choice of this.all_choices){
      let pct = this.resultsService.getPercentage(round, 
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
    console.log('winners', winners);

    const leaders = this.getLeaders(round);
    const losers = this.getLosers(round);

    // language
    const isLeading = (leaders.count > 1) ? 'are leading': 'is leading';
    const losingCandidate = (losers.count > 1) ? this.label + 's' : this.label;
    const oneAtaTime = (losers.count > 1) ? ' one at a time' : '';
    const remaining = (this.winner_count > 1) ? 'remaining ' : '';

    return `${leaders.string} ${isLeading} but no ${remaining}${this.label} has over ${this.percentToString(this.winning_percentage)} of the votes. So, the ${losingCandidate} with the fewest votes, ${losers.string}, will be eliminated${oneAtaTime}. Voters who chose ${losers.string} will have their votes transferred to their next preferred choice.`;
  }

  pollSummaryStatement() {
    const wins = (this.winner_count > 1) ? 'win' : 'wins';
    const rounds = (this.total_rounds > 1) ? 'rounds' : 'round';
    const hasTie = this.hasTie(this.total_rounds);

    let electedString:string = this.resultsService.candidateListString(this.results.elected);

    if(hasTie > 0) {
      return this.tieSummaryStatement(hasTie);
    }
    return `After ${this.total_rounds} ${rounds}, ${electedString} ${wins}.`;
  }

  tieSummaryStatement(winnerVoteCount:number) {
    const rounds = (this.total_rounds > 1) ? 'rounds' : 'round';
    let tieParticipants = this.resultsService.getChoicesByVoteCount(this.total_rounds, this.results, winnerVoteCount);
    let tieString = this.resultsService.candidateListString(tieParticipants);
    return `After ${this.total_rounds} ${rounds}, the poll resulted in a tie between ${tieString} `;
  }

  multiWinnerReductionStatement(round) {
    const winners = this.getWinners(round);
    const winnerArray = Object.keys(winners);
    const winnerString = this.resultsService.candidateListString(winnerArray);
    return `Because ${winnerString} has more than the minimum number of votes needed to win and we're looking for multiple winners, we redistribute the extra votes to the remaining ${this.label}s in the next round.`;
  }

  roundSummaryStatement() {

  }

  getLeaders(round) {
    return this.resultsService.getEdges(round, this.results, 'max');
  }

  getLosers(round) {
    return this.resultsService.getEdges(round, this.results, 'min');
  }

  hasTie(round) {
    return this.resultsService.hasTie(round, this.results);
  }

  isLastRound(round) {
    return this.resultsService.isLastRound(round, this.results);
  }


  percentToString(num:number) {
    return (num*100).toFixed(0)+"%";
  }



}
