import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import { Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  template: `
    
    <main>
    <button
      *ngIf="user$ | async"
      [routerLink]="['/polls']"
      mat-button mat-raised-button [color]="'accent'" 
      class="d-block has-icon dark-icon button-large mb-3">View My Polls <i class="fa fa-chevron-right"></i></button>
      <button
      *ngIf="!(user$ | async)"
      [routerLink]="['/auth/login']"
      mat-button mat-raised-button [color]="'accent'" 
      class="d-block has-icon dark-icon button-large mb-3"><i class="fa fa-user-plus"></i>Sign Up to Create a Poll</button>


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

    <h1 class="mb-2 mt-4">What is Ranked Choice Voting?</h1>
      <div class="mb-2 responsive-wrapper">
        <iframe width="700" height="394" class="embed-responsive-item" src="https://www.youtube.com/embed/XIMLoLxmTDw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>

      <p class="mb-1">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
      <p class="mb-2"> Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>

      <p class="pb-4">
        <a href="https://www.fairvote.org" class="btn btn-primary" mat-button mat-raised-button [color]="'accent'" >Learn More at Fairvote.org</a>
        </p>

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
  user$: Observable<any>;
  subscription: Subscription;
  constructor(
              private store: Store, 
              private db: AngularFirestore, 
              private pollService:PollService) {
    // this.polls = db.collection('items').valueChanges();
  }

  ngOnInit() {
    this.store.set('backButton', '');
    this.polls$ = this.store.select<Poll[]>('publicPolls');
    this.user$ = this.store.select<any>('user');
    this.subscription = this.pollService.getPublicPolls().subscribe(); // returns subscription
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
