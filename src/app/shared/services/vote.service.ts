import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable, EMPTY, of } from 'rxjs';
import { tap, filter, map, first } from 'rxjs/operators';

import { Poll, Vote } from '../models/poll.interface';
import { AppSettings } from '../../app.settings';

import { Store } from 'store';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VoteService {


  constructor(
              private router:Router,
              private cookie: CookieService,
              private store:Store,
              @Inject(PLATFORM_ID) private platformId: Object,
              private db: AngularFirestore) { }



  getPoll(id:string):Observable<Poll> {
    console.log('we are asking for the poll now');
    this.db.firestore.enableNetwork();
    return this.db.doc<Poll>(`polls/${id}`).valueChanges()
    .pipe(
          first(),
          tap({
            next: val => { 
              console.log('we have a poll now!!', val);
              // redirect out if we didn't find anything.
              if(val === undefined) {
                this.router.navigate(['/home/not-found']);
              }
              this.store.set('poll', val);
              console.group("now setting the poll and returning the observer");
              if (isPlatformBrowser(this.platformId)) {
              }
              else {
            this.db.firestore.disableNetwork();
              }
              
              return val; 
            }
          })
          );
  }

  submitVote(poll:Poll, vote:Vote) {
    // console.log('submit', poll, vote);

    if(poll.limit_votes) {
      this.cookie.set('rankit-' + poll.id, 'voted',365);
    }

    vote.id = this.db.createId();
    vote.date_created = Date.now();
    return this.db.doc<Vote>(`polls/${poll.id}/votes/${vote.id}`).set(vote);
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
