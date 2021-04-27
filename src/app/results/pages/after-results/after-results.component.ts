import { Component, OnInit } from '@angular/core';


import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from 'store';
import { Poll, Vote, Choice } from '../../../shared/models/poll.interface';
import { VoteService } from '../../../shared/services/vote.service';

@Component({
  selector: 'app-after-results',
  styleUrls: ['./after-results.component.scss'],
  template: `

    <success-card 
      [poll]="poll$ | async"></success-card>

  `
})
export class AfterResultsComponent implements OnInit {
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
            this.store.set('backButton', ['/results/', id, 'summary']);
          } else {
            this.store.set('backButton', `/`);
          }
        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });
  }

}
