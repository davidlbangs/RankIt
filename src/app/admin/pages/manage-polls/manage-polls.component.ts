import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import { Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';

@Component({
  selector: 'app-manage-polls',
  template: `
    <main>
      <h1 class="mb-2 mt-2"><strong>Admin:</strong> Manage All Polls.</h1>
      <hr class="mb-2" />
    <div *ngIf="polls$ | async as polls; else loading;" class="pb-4">

      <mat-card *ngFor="let poll of polls" [routerLink]="['/polls/', poll.id]" class="mb-1 linked-card">
        <mat-card-title>{{poll.title}}</mat-card-title>
        <mat-card-subtitle>{{poll.is_open ? 'Open' : 'Closed' }} – {{poll.vote_count ? poll.vote_count + ' votes' : 'No Votes'}} {{ poll.is_promoted ? ' – Promoted Poll' : '' }}</mat-card-subtitle>
      </mat-card>

      <mat-card *ngIf="polls.length == 0">
        <mat-card-title>No polls yet! How about making one?</mat-card-title>
      </mat-card>
      <button *ngIf="more"
      mat-button
      class="d-block has-icon dark-icon button-large p-1" (click)="moreResults()">More Results</button>
      <button *ngIf="more"
      mat-button
      class="d-block has-icon dark-icon button-large p-1" (click)="reset()">Reset</button>
    </div>

    <ng-template #loading>
      <div class="message">
        <img src="/assets/images/loading.svg" alt="" />
        Fetching polls...
      </div>
    </ng-template>
    </main>
  `,
  styleUrls: ['./manage-polls.component.scss']
})
export class ManagePollsComponent implements OnInit {
  polls$: Observable<Poll[]>;
  more = false;
  subscription: Subscription;
  subscription2: Subscription;
  constructor(
              private store: Store,
              private db: AngularFirestore,
              private pollService:PollService) {}

  ngOnInit() {
    this.store.set('backButton', 'account');
    this.polls$ = this.store.select<Poll[]>('adminPolls');
    this.subscription2 = this.store.select<boolean>('adminPollsMore').subscribe(res => {
      this.more = res;
    });
/*
    var b1 = 0;
    var b2 = 0;
    var up = 0;
    var d = 0;
    this.db.collection<Poll>('polls').valueChanges().subscribe(polls => {
      if (polls) {
      for (var i = 0; i < polls.length; i++) {
        let poll = polls[i];

        if (poll.results_public === undefined) {
          b1++;
        }
        if (poll.results_public === undefined && up < 1000) {
          this.db.doc(`polls/${poll.id}`).update({'results_public': true}).then(f => {
           d++;
           console.log("done: ", d);
           if (d>=up) {
             console.log("all done");
              b1 = 0;
              b2 = 0;
              up = 0;
              d = 0;
           }
          });
          up++;
        }
        /*if (poll.results_public === undefined) {
          b2++;
          this.db.doc(`polls/${poll.id}`).update({'results_public': true});
        }*
      }
    }
    })
    */
    this.subscription = this.pollService.getAdminPolls().subscribe(res => {

    })// .subscribe();
  }
  moreResults() {

    this.subscription.unsubscribe();
    this.subscription = this.pollService.getAdminPolls().subscribe(res => {

    }); // .subscribe();
  }
  reset() {

    this.subscription.unsubscribe();
    this.subscription = this.pollService.getAdminPollsReset().subscribe(res => {

    })// .subscribe();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
