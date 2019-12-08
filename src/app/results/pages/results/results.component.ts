import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Store } from 'store';
import { Observable, Subscription } from 'rxjs';
import { map, distinct, tap  } from 'rxjs/operators';

import { ResultsService } from '../../../shared/services/results.service';

import { AppSettings } from '../../../app.settings';

import { Poll, Vote, Choice, Results } from '../../../shared/models/poll.interface';
import { VoteService } from '../../../shared/services/vote.service';
import { MetaService } from '@ngx-meta/core';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  template: `
    
      <div *ngIf="poll$ | async as poll; else loading;">
      <header class="poll-header">
          <h1 class="">{{poll.title}}</h1>  
      </header>

      <main class="clear-footer" *ngIf="poll.results as results; else noResults">
          <div class="alert mt-3" *ngIf="poll.vote_count < (poll.choices.length * 2 + 1)">
            <div>
              Heads up: this poll doesn't have many votes yet. Results are displayed below, but they will be more meaningful once more people have voted. 
            </div>
          </div>
          <h2 class="mt-3 mb-1">
            {{ (round === 0) ? 'Final Result' : 'Round ' + round }}
            <span *ngIf="round === getTotalRounds(results)">(Final Result)</span>
          </h2>
          <p class="mb-1"></p>
          <!--<p class="mb-1">{{poll.vote_count}} votes in {{poll.results.rounds.length}} rounds to elect {{poll.winner_count}} {{poll.label}}s.</p>-->
          <p class="mb-1" *ngIf="shiftedResults$ | async as shiftedResults">{{pollSummaryStatement(shiftedResults, poll.winner_count, poll.vote_count) }}</p>
          
          <hr>

          <div class="mt-3 mb-3" *ngIf="LOCAL_OVERLAY">
            {{ poll.results | json }}

            <hr />
          </div>

          <div class="threshold-container">
          <span class="threshold-explanation">{{ 1/(1 + poll.winner_count) | percent }} TO WIN</span>
          </div>
          

          <div class="mb-3 mt-1">
            <results-graph 
              [results]="shiftedResults$ | async" 
              [all_choices]="poll.choices"
              [round]="round"
              [total_rounds]="poll.results.rounds.length"
              [winner_count]="poll.winner_count"></results-graph>
          </div>

          <hr>

          <h2 class="mt-3 mb-1">{{ round === 0 ? 'Poll' : 'Round'}} Summary</h2>

          <results-explanation 
              [results]="shiftedResults$ | async" 
              [all_choices]="poll.choices"
              [round]="round"
              [total_rounds]="poll.results.rounds.length"
              [total_votes]="poll.vote_count"
              [winner_count]="poll.winner_count"
              [label]="poll.label"></results-explanation> 

          <div class="mt-3 mb-3">
            <share-poll [poll]="poll"></share-poll>
          </div>

          <hr class="mb-3" />
      <p class="mb-2 subtle-text small-text">Percentages may not add up to 100 because some ballots get all their choices eliminated.</p>
      </main>

      <footer class="actions" *ngIf="poll.results as results;">
        <div class="half">
          <button
            *ngIf="round !== 0" 
            (click)="toRound(lastRound, poll)"
            mat-button mat-raised-button [color]="'white'" 
            class="d-block button-large p-1">Back</button>
        </div>
        <div class="half">
          <button
            *ngIf="round < poll.results.rounds.length" 
            (click)="toRound(nextRound, poll)"
            mat-button mat-raised-button [color]="'primary'" 
            class="d-block button-large p-1">See Round {{ nextRound }}</button>
          <button
            mat-button mat-raised-button [color]="'primary'"
            (click)="toAfterResults(poll)"
            class="d-block button-large p-1"
            *ngIf="round ===poll.results.rounds.length" >
            Continue
          </button>
        </div>
    </footer>

        <ng-template #noResults>
           <main>
            <div class="alert" *ngIf="poll.is_open" class="mt-3 mb-3">
              <p class="mb-2">There are no results yet. How about voting?</p>
              <p>
                <button [routerLink]="['/vote', poll.id]"
                mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-pencil"></i>Vote on this Poll</button>
              </p>
            </div>

            <div class="alert" *ngIf="!poll.is_open" class="mt-3 mb-3">
              <p class="mb-2">Hmm...There are no results to display, but this poll is closed. Sorry!</p>
              <p>
                <button [routerLink]="['/']"
                mat-raised-button color="" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-chevron-left"></i>Back to Home Page</button>
              </p>
            </div>
          </main>
        </ng-template>
     </div>


      <ng-template #loading>
          <div class="message">
            <img src="/assets/images/loading.svg" alt="" />
            Fetching poll...
          </div>
      </ng-template>



  `
})
export class ResultsComponent implements OnInit {
    LOCAL_OVERLAY = (environment.production == false) ? true : false;
    poll$: Observable<Poll> = this.store.select('poll');


    shiftedResults$:Observable<Results> = this.store.select('poll')
    .pipe(
          distinct(),
          map((poll:Poll) => this.getShiftedRounds(poll.results)));

    // Local state :)
    round: number;
    shiftedResults: Results;

    // subscription: Subscription;


  constructor(
              private resultsService: ResultsService,
              private readonly meta: MetaService,
              private location:Location,
              private http:HttpClient,
              private router:Router,
              private voteService:VoteService,
              private route:ActivatedRoute,
              private store:Store) { 
  }

  ngOnInit() {

    let user = this.route.snapshot.data.resolverUser;

    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');

        this.round = (params.get('round') === 'summary') ? 0 : parseInt(params.get('round'));


        if(id) {
          this.poll$ = this.voteService.getPoll(id)
          .pipe(
                tap(next => this.meta.setTitle('Results - ' + next.title)),
                tap(next => this.checkRound(next, params.get('round')))
          );

          if(user) {
            this.store.set('backButton', ['/polls/', id]);
          } else {
            this.store.set('backButton', `/`);
          }
        } else {
          this.router.navigate(['/vote/not-found']);
         
        }
       
      });
  }

  getWinnerString(winnerArray) {
    return this.resultsService.candidateListString(winnerArray)
  }

  pollSummaryStatement(results, winner_count, total_votes) {
    return this.resultsService.pollSummaryStatement(results, winner_count, total_votes);
  }

  /**
    * Shifted Rounds fixes the 0 index problem.
    *   Since we want to display the final round up front, 
    *   and each round is numbered starting from 1, it simplifies.
    */
  getShiftedRounds(results:Results) {
    const lastRound = results.rounds.slice(-1)[0];    
    const shiftedResults = {...results, rounds: [...results.rounds]};

    shiftedResults.rounds.unshift(lastRound);
    return shiftedResults;
  }

  checkRound(poll:Poll, currentRound) {

    if(poll.results && poll.results.rounds.length < currentRound) {
      this.router.navigate(['/results/' + poll.id]);
    }
  }

  getLastRound(results:Results) {
    return results.rounds.length;
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

  toAfterResults(poll:Poll){
    this.router.navigate(['results', 'share', poll.id]);
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
