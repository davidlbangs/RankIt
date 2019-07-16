import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, EMPTY, of } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Poll } from '../models/poll.interface';
import { AppSettings } from '../../app.settings';


import { Store } from 'store';


@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(
    private store:Store,
    private db: AngularFirestore) { }

  polls$: Observable<Poll[]> = this.db.collection<Poll>('polls', ref => ref.where('owner_uid', '==', AppSettings.owner_uid)).valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('polls', val)
          })
          );

  getPoll(key:string) {
    if (!key) {
      return EMPTY; // no key? return an empty observable.
    } 

    return this.store.select<Poll[]>('polls')
    .pipe(
          filter(Boolean),
          map((polls:Poll[]) =>  polls.find((poll: Poll) => poll.id === key))
          );
  }

  initializePoll() {
    let initialPoll = AppSettings.defaultPoll;
    return of(initialPoll);
  }

  addPoll(poll:Poll) {
    // TODO: pull real owner_uid
    poll.owner_uid = AppSettings.owner_uid;

    poll.id = this.db.createId(); // create the ID first, then use it to set.
    return this.db.doc(`polls/${poll.id}`).set(poll);
    console.log('add', poll);
  }

  updatePoll(key:string, poll:Poll) {
    return this.db.doc(`polls/${key}`).update(poll);
  }

  removePoll(poll:Poll) {
    console.log('remove', poll);
  }
}

// polls.filter(p => p.id === key).shift()
// polls.find((poll: Poll) => poll.id === key)