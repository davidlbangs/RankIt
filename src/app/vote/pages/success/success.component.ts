import { Component, OnInit } from '@angular/core';

import { AppSettings } from '../../../app.settings';
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

    <div class="success-panel" *ngIf="poll$ | async as poll">
      <main>
      hey
        <h1>{{heading}}</h1>

        {{body}}

        <a href="{{ctaUrl(poll)}}">{{ctaLabel(poll)}}</a>
      </main> 
    </div>

    <footer class="actions">
        <button 
          mat-button mat-raised-button [color]="'primary'" 
          class="d-block has-icon dark-icon button-large p-1">View Results</button>
    </footer>
  `
})
export class SuccessComponent implements OnInit {

  defaultText = AppSettings.defaultText;

  poll$:Observable<Poll> = this.store.select('poll');

  constructor(
              private route:ActivatedRoute,
              private router:Router,
              private voteService:VoteService,
              private store:Store) { }

  ngOnInit() {

    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');
        if(id) {
          this.poll$ = this.voteService.getPoll(id);
        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });
  }

  get heading() {
    return this.defaultText.successTitle;
  }

  get body() {
    return this.defaultText.successBody;
  }

  ctaLabel(poll:Poll) {
    if(poll.cta.custom) {
      return poll.cta.label;
    } else {
      return this.defaultText.successButtonLabel;
    }  
  }

  ctaUrl(poll:Poll) {
    if(poll.cta.custom) {
      return poll.cta.url;
    } else {
      return this.defaultText.successButtonUrl;
    }  
  }

}
