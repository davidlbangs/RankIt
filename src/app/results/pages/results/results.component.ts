import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Store } from 'store';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppSettings } from '../../../app.settings';

import { Poll, Vote, Choice, Results } from '../../../shared/models/poll.interface';
import { VoteService } from '../../../shared/services/vote.service';

@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  template: `
    
      <div *ngIf="poll$ | async as poll; else loading;">
      <header class="poll-header">
          <h1 class="">{{poll.title}}</h1>  
      </header>

      <main class="clear-footer" *ngIf="poll.results as results; else noResults">
          <h2 class="mt-3 mb-1">
            {{ (round === 0) ? 'Final Result' : 'Round ' + round }}
            <span *ngIf="round === getTotalRounds(results)">(Final Result)</span>
          </h2>
          <p class="mb-1">{{poll.vote_count}} Votes in 3 Rounds</p>
          
          <hr>
          {{results | json }}

          <hr />
          <div class="mb-3 mt-1">
            <results-graph [results]="tempResults" [round]="'1'"></results-graph>
          </div>

          <hr>

          <h2 class="mt-3 mb-1">Poll Summary</h2>

          <p class="mb-2">After 3 rounds, Jordin Sparks wins with 1226 first-choice votes, 324 second-choice votes, and 99 third-choice votes.</p> 
          <p class="mb-3">Ranked Choice Voting is different from choose-only-one voting. If no singer gets 50% of the vote in round one, the singer with the fewest votes is eliminated and their voters get their next choice. See how Ranked Choice worked for this poll by clicking through the rounds.</p>
      </main>

      <footer class="actions">
      <div class="half">
        <button
          *ngIf="round !== 0" 
          (click)="toRound(lastRound, poll)"
          mat-button mat-raised-button [color]="'white'" 
          class="d-block button-large p-1">Back</button>
      </div>
      <div class="half">
        <button
          (click)="toRound(nextRound, poll)"
          mat-button mat-raised-button [color]="'primary'" 
          class="d-block button-large p-1">See Round {{ nextRound }}</button>
      </div>
    </footer>
     </div>


      <ng-template #noResults>
          <div class="message">
            so...there aren't any results yet.TODO
          </div>
      </ng-template>


      <ng-template #loading>
          <div class="message">
            <img src="/assets/images/loading.svg" alt="" />
            Fetching poll...
          </div>
      </ng-template>



  `
})
export class ResultsComponent implements OnInit {
    poll$: Observable<Poll> = this.store.select('poll');
    subscription:Subscription;

    round: number;
    // user$ :Observable<any> = this.store.select('user').pipe(
    //                                                         tap({
    //                                                             next: this.store.set('backButton', 'polls')
    //                                                             }));

  newResults = { 
    "elected": [ "Elliott" ], 
    "rounds": [ 
      { "Elliott": 9, "James": 4, "Lewis": 2, "Micah": 6 }, 
      { "Elliott": 9, "James": 5, "Micah": 6 }, 
      { "Elliott": 9, "Micah": 7 } ], 
      "threshold": 11 
    }
    
  tempResults = [
    {
    'percentages': [.31, .49, .52],
    'label': 'Jordin Sparks',
    'initial_order': 0,
    'victory_round': 1,
    'elimination_round': null
    },
    {
    'percentages': [.31, .33, .41],
    'label': 'Chris Daughtry',
    'initial_order': 2,
    'victory_round': null,
    'elimination_round': null
    },
    {
    'percentages': [.16, .16, .16],
    'label': 'Kelly Clarkson',
    'initial_order': 1,
    'victory_round': null,
    'elimination_round': null
    },
    {
    'percentages': [.08, .08, 0],
    'label': 'Ruben Studdard',
    'initial_order': 4,
    'victory_round': null,
    'elimination_round': null
    },
    {
    'percentages': [.08, 0, 0],
    'label': 'Taylor Hicks',
    'initial_order': 4,
    'victory_round': null,
    'elimination_round': 2
    }
  ];

  constructor(
              private location:Location,
              private http:HttpClient,
              private router:Router,
              private voteService:VoteService,
              private route:ActivatedRoute,
              private store:Store) { 
  }

  ngOnInit() {

    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');


        this.round = (params.get('round') === 'summary') ? 0 : parseInt(params.get('round'));

        console.log(params);
        if(id) {
          this.poll$ = this.voteService.getPoll(id);
        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });
  }

  getTotalRounds(results:Results) {
    return results.rounds.length;
  }

  toRound(destination:number, poll:Poll) {

    // update local state
    this.round = destination;

    // tell the router about the change.
    this.updateLocation(destination, poll.id);

  }

  updateLocation(currentRound:number | 'summary', id:string) {
    const destination = (currentRound > 0) ? currentRound : 'summary';
    return window.history.pushState({}, '', `/results/${id}/${destination}`);
  }

  get nextRound() {
    return this.round + 1;
  }
  get lastRound() {
    return this.round - 1;
  }

  ngOnDestroy() {

  }

}
