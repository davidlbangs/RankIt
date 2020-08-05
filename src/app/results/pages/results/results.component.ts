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
import { MetaService } from 'meta';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-results',
  styleUrls: ['./results.component.scss'],
  template: `
    
      <div *ngIf="poll$ | async as poll; else loading;">
      <div *ngIf="poll.is_published">
      <header style="border-bottom-left-radius:20px;border-bottom-right-radius:20px;" class="poll-header" [ngStyle]="{'background': poll.customizations?.barColor != '' ? poll.customizations?.barColor : '#EAEDF0', 'color': poll.customizations?.color != '' ? poll.customizations?.color : '#69757C'}">
        <p [ngStyle]="{'color': poll.customizations?.color != '' ? poll.customizations?.color : '#283136;'}" class="">{{poll.title}}</p>
          <h1 class="mb-1" *ngIf="poll.results_public">
            {{pollSummaryStatement(poll.results, poll.winner_count, poll.vote_count) }}
          </h1>
          <share-poll *ngIf="summary" [poll]="poll"></share-poll>
      </header>

      <ng-container *ngIf="poll.results_public else noResultsYet">
      <main class="clear-footer" *ngIf="poll.results as results; else noResults">
          <div *ngIf="poll.vote_count < (poll.choices.length * 2 + 1)">
            <div class="alert mt-3">
              <div [ngStyle]="{'background': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#C9519B'}">
                <h3 class="mb-2 color-white">Heads Up</h3>
                <p>This poll doesn't have many votes yet. Results are displayed below, but they will be more meaningful once more people have voted. Share the poll to get more voters!</p>
              </div>
            </div>

            <hr class="mt-4 mb-4" />
          </div>
          <h1 class="mt-3 mb-1">
            {{ (summary) ? 'Final Result' : 'Round ' + round }} 
            <span *ngIf="round === getTotalRounds(results) && !summary">(Final Result)</span>
            <a (click)="toggleDisplayStyle()" *ngIf="poll.vote_count > (poll.choices.length * 2 + 1)" class="count-link">Show {{(LOCAL_DISPLAY_COUNT) ? 'Vote Percentage' : 'Vote Count' }}</a>
          </h1>
          <p class="mb-1"></p>
          <!--<p class="mb-1">{{poll.vote_count}} votes in {{poll.results.rounds.length}} rounds to elect {{poll.winner_count}} {{poll.label}}s.</p>-->
         
         <!--
          <p class="mb-1">
            {{pollSummaryStatement(poll.results, poll.winner_count, poll.vote_count) }}
          </p>  -->
          

          <!-- <div class="mt-3 mb-3" *ngIf="LOCAL_OVERLAY">
            {{ poll.results | json }}

            <hr />
          </div>
        -->
          <div>
         <!--  <span class="threshold-explanation">{{ 1/(1 + poll.winner_count) | percent }} TO WIN</span> -->
          </div>
          

          <div class="mb-3 mt-1 mobileColumn" >
            <results-graph 
              [display_count]="LOCAL_DISPLAY_COUNT"
              [total_votes]="poll.vote_count"
              [results]="shiftedResults$ | async" 
              [all_choices]="poll.choices"
              [round]="summary ? poll.results.rounds.length : round"
              [summary]="summary"
              [total_rounds]="poll.results.rounds.length"
              [winner_count]="poll.winner_count"></results-graph>
          </div>
          <div class="mobileColumn right">
          <h2 class="mt-3 mb-1">{{ summary ? 'Poll' : 'Round'}} Summary</h2>

          <results-explanation
              *ngIf="poll.vote_count > (poll.choices.length * 2 + 1)" 
              [results]="poll.results" 
              [all_choices]="poll.choices"
              [round]="round-1"
              [summary]="summary"
              [total_rounds]="poll.results.rounds.length"
              [total_votes]="poll.vote_count"
              [winner_count]="poll.winner_count"
              [label]="poll.label"></results-explanation> 


          <p *ngIf="poll.vote_count < (poll.choices.length * 2 + 1)">There are not yet enough votes to show a meaningful summary.</p>

          </div>
          <div class="clear"></div>

          <hr class="mb-3" />
      <p class="mb-2 subtle-text small-text">A vote becomes "inactive" when all their choices are eliminated.</p>
      </main>
<div style="footerWrapper">
      <footer class="actions" *ngIf="poll.results as results;">
        <div class="half first">
          <button
            *ngIf="round !== 0 && !summary" 
            (click)="toRound(lastRound, poll)"
            mat-button mat-raised-button [color]="'white'" 
            class="d-block button-large p-1">Back</button>
            
        </div>
        <div class="half">
          <button
            *ngIf="summary == false && round < poll.results.rounds.length" 
            (click)="toRound(nextRound, poll)" [ngStyle]="{'background': poll.customizations?.buttonColor2 != '' ? poll.customizations?.buttonColor2 : '#673ab7'}"
            mat-button mat-raised-button [color]="'primary'" 
            class="d-block button-large p-1">See Round {{ nextRound }}</button>
          <button
            *ngIf="summary" 
            (click)="toRound(nextRound, poll)" [ngStyle]="{'background': poll.customizations?.buttonColor2 != '' ? poll.customizations?.buttonColor2 : '#673ab7'}"
            mat-button mat-raised-button [color]="'primary'" 
            class="d-block button-large p-1">See Results by Round</button>
          
          
          <button
            mat-button mat-raised-button [color]="'primary'" [ngStyle]="{'background': poll.customizations?.buttonColor2 != '' ? poll.customizations?.buttonColor2 : '#673ab7'}"
            (click)="toAfterResults(poll)"
            class="d-block button-large p-1"
            *ngIf="!summary && round ===poll.results.rounds.length" >
            Finish
          </button>
        </div>
    </footer>
    </div>
    </ng-container>

        <ng-template #noResults>
           <main>
            <div class="alert" *ngIf="poll.is_open" class="mt-3 mb-3" [ngStyle]="{'background': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#C9519B'}">
              <p class="mb-2">There are no results yet. How about voting?</p>
              <p>
                <button [routerLink]="['/vote', poll.id]"
                mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-pencil"></i>Vote on this Poll</button>
              </p>
            </div>

            <div class="alert" *ngIf="!poll.is_open" class="mt-3 mb-3" [ngStyle]="{'background': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#C9519B'}">
              <p class="mb-2">Hmm...There are no results to display, but this poll is closed. Sorry!</p>
              <p>
                <button [routerLink]="['/']"
                mat-raised-button color="" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-chevron-left"></i>Back to Home Page</button>
              </p>
            </div>
          </main>
        </ng-template>

        <ng-template #noResultsYet>
           <main>
            <div class="alert" *ngIf="poll.is_open" class="mt-3 mb-3" [ngStyle]="{'background': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#C9519B'}">
              <p class="mb-2">The creator of this poll is currently holding the results. Please check back later.</p>
              
                <share-poll [poll]="poll"></share-poll>
            </div>

            <div class="alert" *ngIf="!poll.is_open" class="mt-3 mb-3" [ngStyle]="{'background': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#C9519B'}">
              <p class="mb-2">The creator of this poll is currently holding the results. Please check back later.</p>
              <p>
                <button [routerLink]="['/']"
                mat-raised-button color="" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-chevron-left"></i>Back to Home Page</button>
              </p>
            </div>
          </main>
        </ng-template>
     </div>

    <div *ngIf="!poll.is_published">
    Poll not found.
  </div>
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
    LOCAL_DISPLAY_COUNT:boolean = false;
    LOCAL_OVERLAY = (environment.production == false) ? true : false;
    poll$: Observable<Poll> = this.store.select('poll');


    shiftedResults$:Observable<Results> = this.store.select('poll')
    .pipe(
          distinct(),
          map((poll:Poll) => this.getShiftedRounds(poll.results)));

    // Local state :)
    round: number;
    summary: boolean = false;

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

        this.round = parseInt(params.get('round'));
        

        this.summary = params.get('round') === 'summary';
        if (this.summary) {
          this.round = 1;
        }


        if(id) {
          this.poll$ = this.voteService.getPoll(id)
          .pipe(
                tap(next => this.meta.setTitle('Results - ' + next.title)),
                tap(next => this.checkRound(next, params.get('round'))),
                tap(next => {
                  if (next.owner_uid == user?.uid && next.is_published == false) {
                    next.is_published = true;
                    next.results_public = true;
                  }
                  if (next.owner_uid == user?.uid && next.results_public == false) {
                    next.results_public = true;
                  }
                })
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

  toggleDisplayStyle() {
    this.LOCAL_DISPLAY_COUNT = !this.LOCAL_DISPLAY_COUNT;
  }

  getWinnerString(winnerArray) {
    return this.resultsService.candidateListString(winnerArray)
  }

  pollSummaryStatement(results, winner_count, total_votes) {
    //console.log('round count', results.rounds.length, results.rounds);
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
    if (destination <= 0) {
      destination = 1;
      this.summary = true;
    }
    else {
      this.summary = false;
    }
    console.log("setting round: ", destination);
    // update local state
    this.round = destination;

    
    if (this.summary) {
      this.updateLocation('summary', poll.id);
    }
    else {
      this.updateLocation(destination, poll.id);
    }
  }

  toAfterResults(poll:Poll){
    this.router.navigate(['results', 'share', poll.id]);
  }

  updateLocation(currentRound:number | 'summary', id:string) {
    const destination = (currentRound > 0) ? currentRound : 'summary';
    return window.history.pushState({}, '', `/results/${id}/${destination}`);
  }

  get nextRound() {
    if (this.summary) {
      return 1;
    }
    return this.round + 1;
  }
  get lastRound() {
    return this.round - 1;
  }

  ngOnDestroy() {
  }

}
