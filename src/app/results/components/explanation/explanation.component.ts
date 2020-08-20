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
        <p *ngIf="true" class="mb-2">With Ranked Choice Voting (RCV), voters get to rank candidates in order of choice. All ballots are counted in each round and your vote goes to the candidate you ranked highest (among those candidates still in the running).</p>

        <p *ngIf="isMultiWinner" class="mb-2">In a multi-winner ranked choice voting poll with {{winner_count}} winners, each winner must get at least {{ 1 / (winner_count + 1) | percent }} of the vote or be the last {{label}} standing. The percentage of votes required (threshold) depends on how many seats are being elected - the more seats there are to fill, the lower the percentage needed to win. If a candidate passes the threshold, extra votes count toward their voters’ next choices.</p>
        <p *ngIf="false">Voters rank candidates in order of choice. If no candidate meets the percentage of votes needed to win, the candidate with the lowest number of votes is eliminated and voters who picked that candidate will have their votes count for their next choice. If a candidate does meet the percentage of votes needed, any extra votes count proportionally toward voters’ next choices.</p>
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

        <p class="mb-2" *ngIf="elemination(round)">
        {{eleminationStatement(round)}}
        </p>
      </ng-template>
    </div>
     
  `
})
export class ExplanationComponent implements OnInit {
  @Input() results: Results;
  @Input() winner_count: number;
  @Input() summary: boolean;
  @Input() round: number;
  @Input() all_choices: Choice[];
  @Input() total_rounds: number;
  @Input() total_votes: number;
  @Input() label:string = 'choice';

  get rounds() { return this.results.rounds; }
  get winning_percentage() { return 1 / (this.winner_count + 1); }
  get threshold() { return this.results.threshold; }
  get isMultiWinner() { return (this.winner_count > 1) ? true : false; }
  get isWinningRound() { return (this.round === this.total_rounds);}
  constructor(private resultsService: ResultsService) { }

  ngOnInit() {

    console.log('results', this.results);
  }

  isPollSummary(round) { return this.summary || this.isLastRound(round);}
  

  roundHasWinner(round) {
    console.log("rounds: ", this.rounds, round);
    const values = Object.values(this.rounds[round]);
    const largest = Math.max(...values);
    // console.log(round, largest, this.results.threshold);
    return (largest >= this.results.threshold) ? largest : 0;
  }

  elemination(round) {
    if (this.results.eleminated) {
      for (let el of this.results.eleminated) {
        if (el.round == (round+1) && el.from > 1) {
          return true;
        }
        if (el.round == (round) && el.from > 1) {
          return true;
        }
      }
    }
    
    return false;
  }
  getEleminatedForRound(round) {
    for (let el of this.results.eleminated) {

      if (el.round == (round)) {
        return el.name;
      }
    }
  }
  eleminationStatement(round) {
    return "";
    for (let el of this.results.eleminated) {
      /*if (el.round == (round+1) && el.from > 1) {
        return "We have a tie between results, a random choice will be removed in the next round.";
      }*/
      if (el.round == (round) && el.from > 1) {
        return ""+el.name+` has been eliminated and their votes redistributed to the remaining ${this.label}s.`;
      }
    }
    return "";
  }

  getWinners(round) {
    let winners = {};
    for(let choice of this.all_choices){
      let pct = this.resultsService.getPercentage((round), 
                                             choice, 
                                             this.results, 
                                             this.rounds, 
                                             this.winner_count, 
                                             this.winning_percentage, 
                                             this.threshold,
                                             this.total_votes);
      if(pct > this.winning_percentage) {
        winners[choice] = pct;
      }
    }
    console.log(winners);
    return winners;
  }

  winnerSummaryStatement(round) {
    const winners = this.getWinners(round);
    const winnerArray = Object.keys(winners);
    var totalWinnersThusFar = 0;
    for (var i = 0; i <= round; i++) {

      const winnersT = this.getWinners(round);
      totalWinnersThusFar += Object.keys(winnersT).length;
    }
    const pctNumArray:number[] = Object.values(winners);
    const pctStrArray:string[] = pctNumArray.map((x:number) => this.percentToString(x));

    // language
    const aWinner = (winnerArray.length > 1) ? 'multiple winners this round' : 'a winner';
    const winnerString = this.resultsService.candidateListString(winnerArray);
    const wins = (winnerArray.length > 1) ? 'win' : 'wins';
    const pctString = this.resultsService.candidateListString(pctStrArray);
    const respectively = (winnerArray.length > 1) ? ', respectively' : '';
    var extra = '';
    if (totalWinnersThusFar < this.winner_count) {
      let more = this.winner_count - totalWinnersThusFar;
      if (more == 1) {
        extra = ' One more winner will be chosen.'
      }
      else {
        extra = more + ' more winners be chosen.';
      }
    }

    return `We have ${aWinner}! ${winnerString} ${wins} with ${pctString} of the vote${respectively}. `+extra;
  }

  noWinnerSummaryStatement(round) {
    const winners = this.getWinners(round);
    // console.log('winners', winners);

    const leaders = this.getLeaders(round);
    const losers = this.getLosers(round);

    const eleminatedNextRound = this.getEleminatedForRound(round);
    

    // language
    const isLeading = (leaders.count > 1) ? 'are leading': 'is leading';
    const losingCandidate = (losers.count > 1) ? this.label + 's' : this.label;
    const oneAtaTime = (losers.count > 1) ? ' one at a time' : '';
    const remaining = (this.winner_count > 1) ? 'remaining ' : '';
    if (losers.count > 1) {
      return `${leaders.string} ${isLeading} but no ${remaining}${this.label} has over ${this.percentToString(this.winning_percentage)} of the votes. Because there is a tie for last place, one of the losing ${losingCandidate} will be randomly eliminated: ${eleminatedNextRound}. Their votes will be redistributed to the voters' next-favorite ${this.label}.`;
     // return `${leaders.string} ${isLeading} but no ${remaining}${this.label} has over ${this.percentToString(this.winning_percentage)} of the votes. Because there is a tie for last place, one of the losing ${losingCandidate} will be randomly eliminated. Their votes will be redistributed to the voters' next-favorite ${this.label}.`;
    }
    else {
      return `${leaders.string} ${isLeading} but no ${remaining}${this.label} has over ${this.percentToString(this.winning_percentage)} of the votes. So, the ${losingCandidate} with the fewest votes, ${losers.string}, will be eliminated${oneAtaTime}. Voters who chose ${losers.string} will have their votes redistributed to the remaining ${this.label}s based on their next preferences.`;
    }
    //return `${leaders.string} ${isLeading} but no ${remaining}${this.label} has over ${this.percentToString(this.winning_percentage)} of the votes. So, the ${losingCandidate} with the fewest votes, ${losers.string}, will be eliminated${oneAtaTime}. Voters who chose ${losers.string} will have their votes redistributed to the remaining ${this.label}s based on their next preferences.`;
  }

  pollSummaryStatement() {
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
    return this.resultsService.getEdges((round), this.results, 'max');
  }

  getLosers(round) {
    return this.resultsService.getEdges((round), this.results, 'min');
  }

  isLastRound(round) {
    return this.resultsService.isLastRound((round), this.results);
  }


  percentToString(num:number) {
    return (num*100).toFixed(0)+"%";
  }



}
