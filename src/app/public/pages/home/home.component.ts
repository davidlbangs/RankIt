import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Store } from 'store';
import { Description, Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';

declare var firebase;

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  template: `
  <div class="subHeader">
    <button
    *ngIf="!(user$ | async)"
    [routerLink]="['/auth/login']"
    mat-button mat-raised-button [color]="'primary'"
    class="d-block has-icon dark-icon button-large mb-3"><i class="fa fa-user-plus"></i>Sign Up</button>
</div>
    <main>
   <div class="clear"></div>
      <div class="mobileColumn">
   <h1 class="mb-2 mt-2">Featured Polls</h1>
      <hr class="mb-2" />
    <div *ngIf="polls$ | async as polls; else loading;">

        <mat-card *ngFor="let poll of polls" [routerLink]="['/vote', poll.id]" class="mb-1 linked-card">
        <mat-card-title>{{poll.title}}</mat-card-title>
        <mat-card-subtitle>{{poll.is_open ? 'Open' : 'Closed' }} – {{poll.vote_count ? poll.vote_count + ' votes' : 'No Votes'}}</mat-card-subtitle>

        <mat-card *ngIf="polls.length > 10">
          <mat-card-title>No polls yet! How about making one?</mat-card-title>
        </mat-card>
      </mat-card>

    </div>
    <div  *ngIf="loggedIn">
    <h1 class="mb-2 mt-2">My Recent Polls</h1>
    <hr class="mb-2" />
  <div *ngIf="myPolls$ | async as polls; else loading;">

      <mat-card *ngFor="let poll of polls" [routerLink]="['/vote', poll.id]" class="mb-1 linked-card">
      <mat-card-title>{{poll.title}}</mat-card-title>
      <mat-card-subtitle>{{poll.is_open ? 'Open' : 'Closed' }} – {{poll.vote_count ? poll.vote_count + ' votes' : 'No Votes'}}</mat-card-subtitle>

      <mat-card *ngIf="polls.length > 10">
        <mat-card-title>No polls yet! How about making one?</mat-card-title>
      </mat-card>
    </mat-card>

  </div>
  <a  [routerLink]="['/polls']">See all My Polls</a>
  </div>
    </div>
    <div class="mobileColumn right" *ngIf="description$ | async as description">
        <home-description [content]="description"></home-description>

    </div>
    <div class="clear"></div>
    <ng-template #loading>
      <div class="message">
        <img src="/assets/images/loading.svg" alt="" />
        Fetching polls...
      </div>
    </ng-template>

    </main>

  `
})
export class HomeComponent implements OnInit {
  polls$: Observable<Poll[]>;
  myPolls$: Observable<Poll[]>;
  description$: Observable<Description>;

  user$: Observable<any>;
  loggedIn: boolean = false;
  subscription: Subscription;
  subscription2: Subscription = null;
  constructor(
    private store: Store,
    private db: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private pollService: PollService) {
    // this.polls = db.collection('items').valueChanges();
  }

  ngOnInit() {
    this.store.set('backButton', '');
    this.polls$ = this.store.select<Poll[]>('publicPolls');
    this.myPolls$ = this.store.select<Poll[]>('recentPolls');
    this.user$ = this.store.select<any>('user');
    this.user$.subscribe(user => {
      if (user) {
        if (this.subscription2 == null) {
          this.subscription2 = this.pollService.getRecentUserPolls().subscribe();
        }
        this.loggedIn = true;
      }
    });
    this.subscription = this.pollService.getPublicPolls().subscribe(); // returns subscription

    this.description$ = this.pollService.getDescription();



    this.analytics.logEvent('test').then(r => {
      console.log('R: ', r);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }

}
