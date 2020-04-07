import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';
import { MetaService } from 'src/meta';

@Component({
  selector: 'polls-by-user',
  styleUrls: ['./polls-by-user.component.scss'],
  template: `
    
    <main>
   <h1 class="mb-2 mt-2">Polls for (USER)</h1>
      <hr class="mb-2" />
    <div *ngIf="polls$ | async as polls; else loading;">

        <mat-card *ngFor="let poll of polls" [routerLink]="['/polls', poll.id]" class="mb-1 linked-card">
        <mat-card-title>{{poll.title}}</mat-card-title>
        <mat-card-subtitle>{{poll.is_open ? 'Open' : 'Closed' }} – {{poll.vote_count ? poll.vote_count + ' votes' : 'No Votes'}} {{ poll.is_promoted ? ' – Promoted Poll' : '' }}</mat-card-subtitle>
     

        <mat-card *ngIf="polls.length == 0">
          <mat-card-title>No polls yet! How about making one?</mat-card-title>
        </mat-card>
      </mat-card>
        
    </div>

    <ng-template #loading>
      <div class="message">
        <img src="/assets/images/loading.svg" alt="" />
        Fetching polls...
      </div>
    </ng-template>
    </main>

  `
})
export class PollsByUserComponent implements OnInit {
  polls$: Observable<Poll[]>;
  subscription: Subscription;
  constructor(
              private meta:MetaService,
              private route:ActivatedRoute,
              private store: Store, 
              private db: AngularFirestore, 
              private pollService:PollService) {}

  ngOnInit() {
    this.store.set('backButton', '/admin/manage-users');
    
    this.polls$ = this.route.params
    .pipe(
          switchMap(param => {
            this.subscription = this.pollService.getUserPolls(param.id).subscribe();
            return this.store.select<Poll[]>('polls');
            // return poll;
          })
          );
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
