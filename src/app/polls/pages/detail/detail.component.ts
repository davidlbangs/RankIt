import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


import { Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-detail',
  styleUrls: ['./detail.component.scss'],
  template: ` 

    <div class="detail" *ngIf="poll$ | async as poll">
      <header class="poll-header">
        <h1 class="">{{ poll.title }}</h1>
        <p>
          <span *ngFor="let choice of poll.choices; let i = index">
            {{ (i + 1) < poll.choices.length ? choice + ', ' : choice }}
            
          </span>
        </p>  
        <p *ngIf="poll.winner_count > 1">
          ({{poll.winner_count}} Winners)
        </p>
      </header>
      <main class="mb-3">
        <div class="card promo-votes mt-2 mb-2">
          <div class="label"><p>Voters</p></div>
          <div class="count"><h1>{{poll.vote_count}}</h1></div>
        </div>

        <mat-card class="mb-2">
          <mat-slide-toggle [checked]="poll.is_open" (click)="toggleOpen(poll)">
            {{poll.is_open ? 'Open, Accepting Votes' : 'Closed, Not Accepting Votes'}}
          </mat-slide-toggle>

          <p *ngIf="poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until you close it.</p>
          <p *ngIf="!poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until {{poll.length.end_time | date : 'long'}}</p>
        </mat-card>

        <button 
          [routerLink]="['/results', poll.id, 'summary']" 
          mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-signal"></i>View Results</button>
        <button [routerLink]="['/vote', poll.id]"
          [disabled]="!poll.is_open"
        mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-pencil"></i>Vote on this Poll</button>
      </main>

      <hr class="mb-3" />

      <main class="pb-3">
        <h1 class="mb-1">Promote Poll</h1>

        <share-poll [poll]="poll"></share-poll>
        <embed-poll [poll]="poll"></embed-poll>
        <hr class="mt-3 mb-4" />
        <button (click)="toggleDelete()" mat-stroked-button color="red" class="has-icon"><i class="fa fa-times"></i>Delete Poll</button>
        <div class="confirmDelete" *ngIf="showDelete">
          Are you sure? <button mat-raised-button color="warn" (click)="deletePoll(poll)">Delete</button> <button mat-button (click)="toggleDelete()">Cancel</button>
        </div>
      </main>
    </div>

    

  `
})
export class DetailComponent implements OnInit {

  poll$: Observable<any>; // should be poll
  subscription: Subscription;

  showDelete:boolean = false;

  constructor(
              private readonly meta: MetaService,
              private pollService: PollService,
              private router:Router,
              private store:Store,
              private route:ActivatedRoute) {}


  ngOnInit() {
    this.store.set('backButton', 'polls');
    this.subscription = this.pollService.getUserPolls().subscribe();
    
    this.poll$ = this.route.params
    .pipe(
          switchMap(param => {
            const poll = this.pollService.getPoll(param.id);
            return poll;
          }),
          tap(next => this.meta.setTitle(next.title))
          );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async deletePoll(poll:Poll) {
    await this.pollService.deletePoll(poll);

    this.router.navigate(['/polls']);
  }

  toggleOpen(poll:Poll) {
    this.pollService.togglePollOpen(poll.id, poll.is_open);
  }

  toggleDelete() {
    this.showDelete = !this.showDelete;
  }

}
