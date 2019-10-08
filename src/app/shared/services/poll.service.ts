import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, EMPTY, of } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Poll, Description } from '../models/poll.interface';
import { AppSettings } from '../../app.settings';
import { User } from '../models/user.interface';

import { Store } from 'store';


@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(
    private store:Store,
    private db: AngularFirestore) { }

  getUserPolls(uid: string = this.uid) {
    // if(!uid) {
    //   console.log('hi', this.uid);
    //   let uid = this.uid;
    // }

    return this.db.collection<Poll>('polls', ref => ref.where('owner_uid', '==', uid)).valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('polls', val)
          })
          );
  }

  getAdminPolls() {
    return this.db.collection<Poll>('polls').valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('polls', val)
          })
          );
  }

  getExpiredPolls() {
    const pollsRef = this.db.collection('polls', ref => ref.where('keep_open', '==', 'true').where('length.end_time', '<', Date.now()));

    return pollsRef.valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('polls', val)
          })
          );
  }

  // pollsRef.where('keep_open', '==', 'true').where('length.end_time', '<', Date.now())

  getPublicPolls() {
    return this.db.collection<Poll>('polls', ref => ref.where('is_promoted', '==', true).where('is_open', '==', true).orderBy('date_created')).valueChanges()
    .pipe(
          tap({
            next: val => this.store.set('publicPolls', val)
          })
          );
  }

  getDescription() {
    return this.db.doc<Description>('admin/settings').valueChanges();
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
    // console.log('getting uid', this.store.value);
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
    poll.is_promoted = false;
    poll.date_created = Date.now();

    // console.log(poll.owner_uid);

    if(poll.keep_open == false){
      let factor = (poll.length.display_units === 'days') ? 86400000 : 3600000;
      poll.length.end_time = poll.date_created + (poll.length.display_count * factor);
    }

    poll.id = this.db.createId(); // create the ID first, then use it to set.
    await this.db.doc(`polls/${poll.id}`).set(poll);

    return poll.id;
  }

  togglePollOpen(id:string, is_open) {
    // Change if the poll is open, but keep it open once they've switched.
    // That way you can revive expired polls, if you want.
    return this.db.doc(`polls/${id}`).update({'is_open': !is_open, 'keep_open': true });
  }

  togglePollPromoted(id:string, is_promoted) {
    return this.db.doc(`polls/${id}`).update({'is_promoted': !is_promoted});
  }

  updatePoll(key:string, poll:Poll) {
    return this.db.doc(`polls/${key}`).update(poll);
  }

  deletePoll(poll:Poll) {
    return this.db.doc(`polls/${poll.id}`).delete();
  }
}

// polls.filter(p => p.id === key).shift()
// polls.find((poll: Poll) => poll.id === key)