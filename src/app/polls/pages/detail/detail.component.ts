import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


import { Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';

@Component({
  selector: 'app-detail',
  styleUrls: ['./detail.component.scss'],
  template: ` 

    <div class="detail" *ngIf="poll$ | async as poll">
      <header class="poll-header">
        <h1 class="p-3">{{ poll.title }}</h1>  
      </header>
      <main class="mb-3">
        <div class="card promo-votes mt-2 mb-2">
          <div class="label"><p>Voters</p></div>
          <div class="count"><h1>{{poll.vote_count}}</h1></div>
        </div>

        <mat-card class="mb-2">
          open, accepting votes
        </mat-card>

        <a mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon"><i class="fa fa-eye"></i>View Results</a>
        <a mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon"><i class="fa fa-pencil"></i>Vote on this Poll</a>
      </main>

      <hr class="mb-3" />

      <main class="pb-3">
        <h1 class="mb-1">Promote Poll</h1>

        <div class="flex-grid mb-1">
          <button mat-stroked-button color="primary" class="has-icon"><i class="fa fa-link"></i>Copy Link</button>
          <a mat-stroked-button color="primary" class="has-icon"><i class="fa fa-twitter"></i>Tweet</a>
          <a mat-stroked-button color="primary" class="has-icon"><i class="fa fa-facebook-f"></i>Post</a>
        </div>
        <button mat-stroked-button color="primary" class="has-icon d-block mb-5"><i class="fa fa-code"></i>Copy Embed Code</button>
      </main>
    </div>

    

  `
})
export class DetailComponent implements OnInit {

  poll$: Observable<any>; // should be meal
  subscription: Subscription;

  constructor(
              private pollService: PollService,
              private router:Router,
              private store:Store,
              private route:ActivatedRoute) {}


  ngOnInit() {
    this.store.set('backButton', 'polls');
    this.subscription = this.pollService.polls$.subscribe();
    
    this.poll$ = this.route.params
    .pipe(
          switchMap(param => {
            console.log(param);
            let poll = this.pollService.getPoll(param.id);
            return poll;
          })
          );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
