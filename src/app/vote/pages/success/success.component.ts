import { Component, OnInit } from '@angular/core';


import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from 'store';
import { Poll, Vote, Choice } from '../../../shared/models/poll.interface';
import { VoteService } from '../../../shared/services/vote.service';

@Component({
  selector: 'app-success',
  styleUrls: ['./success.component.scss'],
  template: `

    <success-card 
      [poll]="poll$ | async"
      [fromVote]="'true'"></success-card>
<ng-container *ngIf="poll$ | async as poll">
    <footer class="actions" *ngIf="poll.results_public">
        <button *ngIf="poll.results_public"  [ngStyle]="{'backgroundColor': poll.customizations?.buttonColor1 != '' ? poll.customizations?.buttonColor1 : '#ff4081;'}"
          [routerLink]="['/results', poll.id, 'summary']" 
          mat-button mat-raised-button [color]="'accent'" 
          class="d-block has-icon dark-icon button-large p-1">View Results</button>
    </footer></ng-container>
  `
})
export class SuccessComponent implements OnInit {
  poll$:Observable<Poll> = this.store.select('poll');

  constructor(
              private route:ActivatedRoute,
              private router:Router,
              private voteService:VoteService,
              private store:Store) { }

  ngOnInit() {
    let user = this.route.snapshot.data.resolverUser;
    
    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');
        if(id) {
          this.poll$ = this.voteService.getPoll(id);

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

}
