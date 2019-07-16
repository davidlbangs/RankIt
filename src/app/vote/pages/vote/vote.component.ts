import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import {Store } from 'store';
import { Observable } from 'rxjs';

import { AppSettings } from '../../../app.settings';

import { Poll } from '../../../shared/models/poll.interface';

import { VoteService } from '../../../shared/services/vote.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

  defaultText = AppSettings.defaultText;

  user$ = this.store.select('user');

  poll$: Observable<Poll> = this.store.select('poll');

  constructor(
              private router:Router,
              private voteService:VoteService,
              private route:ActivatedRoute,
              private store:Store) { }

  ngOnInit() {

    if(this.uid) {
      this.store.set('backButton', 'polls');
    }

    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');
        // console.log(params);
        if(id) {
          this.poll$ = this.voteService.getPoll(id);
        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });


  }

  
  get uid() {
    if(this.store.value.user) {
      return this.store.value.user.uid;
    }
    else return null;
  }



  shuffle(arr) {
      var i,
          j,
          temp;
      for (i = arr.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
      }
      return arr;    
  };

}
