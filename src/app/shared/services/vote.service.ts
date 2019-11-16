import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, EMPTY, of } from 'rxjs';
import { tap, filter, map, first } from 'rxjs/operators';

import { Poll, Vote } from '../models/poll.interface';
import { AppSettings } from '../../app.settings';

import { Store } from 'store';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VoteService {


  constructor(
              private cookie: CookieService,
              private store:Store,
              private db: AngularFirestore) { }



  getPoll(id:string):Observable<Poll> {
    return this.db.doc<Poll>(`polls/${id}`).valueChanges()
    .pipe(
          first(),
          tap({
            next: val => { this.store.set('poll', val); return val; }
          })
          );
  }

  submitVote(poll:Poll, vote:Vote) {
    // console.log('submit', poll, vote);

    if(poll.limit_votes) {
      this.cookie.set('rankit-' + poll.id, 'voted');
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
