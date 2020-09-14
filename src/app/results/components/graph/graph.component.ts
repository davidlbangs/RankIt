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
  @Input() display_count: boolean;

  get rounds() { return this.results.rounds; }
  get elected() { return this.results.elected; }
  get winning_percentage() { return 1 / (this.winner_count + 1); }
  get threshold() { return this.results.threshold; }

  constructor(
    private resultsService: ResultsService) { }

  ngOnInit() {
    if (this.summary) {
      this.round = this.results.rounds.length - 1;
    }
  }

  get sortedChoices() {
    //    return this.all_choices;
    let sorted = this.all_choices.slice();
    let choicesWithVotes = this.results.rounds[1];

    for (let x of sorted) {
      if (!(x in choicesWithVotes)) {
        sorted.push(sorted.splice(sorted.indexOf(x), 1)[0]);
      }
    }


    let round = this.round;
    sorted = this.all_choices.slice().sort((a, b) => (choicesWithVotes[a] > choicesWithVotes[b]) ? -1 : 1);

    console.log("sorted2: ", sorted);
    let sortedWinners = this.results.elected.sort((a, b) => {
      if (a.round == b.round) {
        if (a.votes == b.votes) {
          if (a.name < b.name) {
            return -1;
          }
          else {
            return 1;
          }
        }
        else {
          if (a.votes < b.votes) {
            return -1;
          } else {
            return 1;
          }
        }
      }
      if (a.round < b.round) {
        return -1;
      } else {
        return 1;
      }
    });
    console.log("sorted w: ", sortedWinners);
    let sortedLoosers = this.results.eleminated.sort((a, b) => {
      if (a.round == b.round) {
        if (a.votes == b.votes) {
          if (a.name < b.name) {
            return -1;
          }
          else {
            return 1;
          }
        }
        else {
          if (a.votes < b.votes) {
            return 1;
          } else {
            return -1;
          }
        }
      }
      if (a.round < b.round) {
        return 1;
      } else {
        return -1;
      }
    });
    console.log("sorted loosers: ", sortedLoosers);
    var newOrder = [];
    for (let sw of sortedWinners) {
      newOrder.push(sw.name);
      sorted.splice(sorted.indexOf(sw.name), 1);
    }
    for (let x of sorted) {
      var found = false;
      for (let y of sortedLoosers) {
        if (y.name == x) {
          found = true;
        }
      }
      if (found == false) {
        newOrder.push(x);
        //sorted.splice(sorted.indexOf(x), 1);
      }
    }
    for (let sw of sortedLoosers) {
      newOrder.push(sw.name);
      sorted.splice(sorted.indexOf(sw.name), 1);
    }
    console.log("new order:", newOrder);
    return newOrder;
  }
  winner(round, choice) {
    let ar: any[] = this.elected;
    for (let d of this.elected) {
      if (d.round >= round) {
        return true;
      }
    }
    return false;
  }
  noWinner(choice) {
    let ar: any[] = this.elected;
    ar = this.elected.map(x => x.name);
    return !ar.includes(choice);
  }

  //
  // * IF It's the last round, we may need to round up
  // So we skip doing the math.
  // However, if it's not the last round, we'll do the math.
  declareWinner(round: number, choice: string) {
    let ar: any[] = this.elected;
    ar = this.elected.map(x => x.name);
    if (round == this.total_rounds || round == 0) {
      return ar.includes(choice);
    } else {
      //console.log("our percentage: ", this.getPercentage(round, choice), Math.round(this.winning_percentage*100)/100)
      return this.getPercentage(round, choice) >= Math.round(this.winning_percentage * 100) / 100;
    }
  }

  getExhaustedVoteCount(round: number) {
    let ar: any[] = this.elected;
    ar = this.elected.map(x => x.name);
    return this.resultsService.getExhaustedVoteCount(round, this.results, this.total_votes, this.winner_count, this.threshold, ar, this.rounds);
  }

  getExhaustedVotePercentage(round: number) {
    let ar: any[] = this.elected;
    ar = this.elected.map(x => x.name);
    return this.resultsService.getExhaustedVotePercentage(round, this.results, this.total_votes, this.winner_count, this.threshold, ar, this.rounds);
  }

  getPercentage(round: number, choice: Choice) {
    return this.resultsService.getPercentage(round,
      choice,
      this.results,
      this.rounds,
      this.winner_count,
      this.winning_percentage,
      this.threshold,
      this.total_votes);
  }
  getPercentage2(round: number, choice: Choice) {
    return Math.round(this.getPercentage(round, choice) * 100) / 100;
  }
  afterLoosingRound(round) {
    for (let i of this.results.eleminated) {
      if (i.round >= 0 && (i.round + 1) < round && i.votes > 0) {
        return true;
      }
    }
    return false;
  }
  getThreshold() {
    return (this.winning_percentage * 100).toFixed(0) + "%";
  }
  getCount(round: number, choice: Choice) {
    return this.resultsService.getCount(round,
      choice,
      this.results,
      this.rounds,
      this.winner_count,
      this.threshold);
  }

  showChange(round: number, choice: Choice) {
    let previousRound = round - 1;
    let currentPercentage = this.getPercentage(round, choice);
    let previousPercentage = this.getPercentage(previousRound, choice);
    let isWinner = this.declareWinner(round, choice);

    // don't show in first round or if it's a winner
    if (round == 1) {
      return false;
    }

    // if different, calculate percentage difference.
    if (previousPercentage && (currentPercentage != previousPercentage)) {

      let delta = currentPercentage - previousPercentage;

      // if percentage change is positive...
      if (delta > 0) {

        // and delta would go flying off the screen.
        if ((delta + previousPercentage) > this.winning_percentage) {
          // return this.winning_percentage - previousPercentage;
        }

      }
      return delta;
    }

    // Otherwise return false
    return false;
  }

  // There's a logical issue
  // with winning situations because of the cut off on the graph.
  getDeltaGrowthWidth(round: number, choice: Choice) {
    let previousRound = round - 1;
    let currentPercentage = this.getPercentage(round, choice);
    let previousPercentage = this.getPercentage(previousRound, choice);
    let isWinner = this.declareWinner(round, choice);

    if (round == 1) {
      return false;
    }

    // if different, calculate percentage difference.
    if (previousPercentage && (currentPercentage != previousPercentage)) {

      let delta = currentPercentage - previousPercentage;

      // if percentage change is positive...
      // and delta would go flying off the screen.
      if (delta > 0 &&
        (delta + previousPercentage) > this.winning_percentage
      ) {

        // reset delta to cap at 1.03
        delta = this.winning_percentage - previousPercentage + .03;
      }
      let f: any = this.showChange(round, choice);
      var total = this.getWidth(this.getPercentage(round, choice) - f) + this.getWidth(delta);

      var c = 0;
      // if this is too high the bar will go over the text
      if (total > 103) {
        c = total - 103;
      }
      // Make percentage
      return this.getWidth(delta) - c;
    }

    // Otherwise return false
    return false;
  }


  getWidth(percentage: number) {
    let width = percentage / this.winning_percentage * 100;
    if (width >= 101) {
      return 103;
    } else {
      return width;
    }
  }


}
