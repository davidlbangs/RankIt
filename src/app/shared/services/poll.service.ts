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

  polls$: Observable<Poll[]> = this.db.collection<Poll>('polls', ref => ref.where('owner_uid', '==', this.uid)).valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('polls', val)
          })
          );

  // publicPolls$: Observable<Poll[]> = this.db.collection<Poll>('polls', ref => ref.where('is_promoted', '==', 'true').where('is_open', '==', 'true').orderBy('date_created')).valueChanges()
  //   .pipe(
  //         tap({
  //           next: val => this.store.set('publicPolls', val)
  //         })
  //         );

  getPublicPolls() {
    return this.db.collection<Poll>('polls', ref => ref.where('is_promoted', '==', true).where('is_open', '==', true).orderBy('date_created')).valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('publicPolls', val)
          })
          );
  }

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

  get uid() {
    if(this.store.value.user) {
      return this.store.value.user.uid;
    } else {
      return null;
    }
  }

  initializePoll() {
    let initialPoll = AppSettings.defaultPoll;
    return of(initialPoll);
  }

  async addPoll(poll:Poll) {
    // TODO: pull real owner_uid
    poll.owner_uid = this.uid;
    poll.vote_count = 0;
    poll.is_open = true;
    poll.date_created = Date.now();
    poll.id = this.db.createId(); // create the ID first, then use it to set.
    console.log('add', poll);
    await this.db.doc(`polls/${poll.id}`).set(poll);

    return poll.id;
  }

  togglePollOpen(id:string, is_open) {
    return this.db.doc(`polls/${id}`).update({'is_open': !is_open });
  }

  updatePoll(key:string, poll:Poll) {
    return this.db.doc(`polls/${key}`).update(poll);
  }

  deletePoll(poll:Poll) {
    console.log("delte", poll);
    return this.db.doc(`polls/${poll.id}`).delete();
  }
}

// polls.filter(p => p.id === key).shift()
// polls.find((poll: Poll) => poll.id === key)