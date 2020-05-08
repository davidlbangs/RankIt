import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, EMPTY, of } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

import { Poll } from '../models/poll.interface';
import { AppSettings } from '../../app.settings';
import { User } from '../models/user.interface';

import { Store } from 'store';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private store:Store,
    private db: AngularFirestore) { }


  toggleUserAdmin(uid, adminRights) {
    // Change if the poll is open, but keep it open once they've switched.
    // That way you can revive expired polls, if you want.
    return this.db.doc(`users/${uid}`).update({'roles.admin': adminRights });
  }
  toggleUserSuper(uid, adminRights) {
    // Change if the poll is open, but keep it open once they've switched.
    // That way you can revive expired polls, if you want.
    return this.db.doc(`users/${uid}`).update({'roles.super': adminRights });
  }
}
