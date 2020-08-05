import { Injectable } from '@angular/core';

import 'rxjs/add/operator/do';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

import { User } from '../../../../shared/models/user.interface';

import { Store } from 'store';


@Injectable()
export class AuthService {
  
  user$: Observable<User | void>;

  constructor(
    private store:Store,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) {

    this.user$ = this.afAuth.authState
      .pipe(
              switchMap( user => {
                 if(user) {
                //   console.log("user: ", user);
                   // temporarily set the user from the auth state.
                   const tempUser = {
                     uid: user.uid,
                     email: user.email
                   }
                   this.store.set('user', user);

                   // get the actual user.
                   return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                 } else {
                   return of(null);
                 }
              }),
              map( next => this.store.set('user', next))
            )
  }


  get authState() {
    return this.afAuth.authState; // observable to keep auth state. returns user.
  }

  get user() {
    return this.afAuth.currentUser;
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: any = { 
      uid: user.uid, 
      email: user.email,
      roles: {
        user: true
      }
    } 

    return userRef.set(data, { merge: true })

  }

  /*
   * ROLES
   */

  canPromotePoll(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }



  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
  } 


  // returns a promise.
  // can call `.then` or async await
  createUser(email: string, password: string) {
     return this.afAuth
       .createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    await this.afAuth.signOut();
    this.store.unset();
    this.router.navigate(['/']);
  }
}