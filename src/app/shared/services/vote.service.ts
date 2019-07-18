import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, EMPTY, of } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Poll, Vote } from '../models/poll.interface';
import { AppSettings } from '../../app.settings';

import { Store } from 'store';


@Injectable({
  providedIn: 'root'
})
export class VoteService {


  constructor(
              private store:Store,
              private db: AngularFirestore) { }



  getPoll(id:string):Observable<Poll> {
    return this.db.doc<Poll>(`polls/${id}`).valueChanges()
    .pipe(
          tap({
            next: val => { this.store.set('poll', val); return val; }
          })
          );
  }

  submitVote(poll:Poll, vote:Vote) {
    console.log('submit', poll, vote);
    vote.id = this.db.createId();
    vote.date_created = Date.now();
    this.db.doc<Vote>(`polls/${poll.id}/votes/${vote.id}`).set(vote);
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
