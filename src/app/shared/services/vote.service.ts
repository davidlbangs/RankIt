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
export class VoteService {


  constructor(
              private store:Store,
              private db: AngularFirestore) { }



  getPoll(id:string):Observable<Poll> {
    return this.db.doc<Poll>(`polls/${id}`).valueChanges()
    .pipe(
          tap({
            next: val => { this.store.set('polls', val); return val; }
          })
          );
  }


}
