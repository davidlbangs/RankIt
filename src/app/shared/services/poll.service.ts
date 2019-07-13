import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

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

  // getPoll(poll:string) {
  //   // this.db.collection('tenets').doc(AppSettings.tenet).collection('posts').doc(id).valueChanges();
  //   if (!poll) {
  //     return of({}); // no key? return an observable.
  //   } 
  //   return this.db.doc<Poll>(`poll/${poll}`).valueChanges().pipe(
  //     tap(next => {
  //       this.store.set('post', next);
  //     }));
  // }
}
