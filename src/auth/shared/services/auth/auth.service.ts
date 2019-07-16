import { Injectable } from '@angular/core';

import 'rxjs/add/operator/do';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

import { Store } from 'store';


export interface User {
  email: string,
  uid: string,
  authenticated: boolean,
  displayName?: string
}


@Injectable()
export class AuthService {
  
  auth$ = this.af.authState
    .do(next => {
      if (!next) {
        this.store.set('user', null);
        return;
      }

      const user:User = {
        email: next.email,
        uid: next.uid,
        authenticated: true
      };
      this.store.set('user', user);
    });

  constructor(
    private store:Store,
    private af: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) {}


  get authState() {
    return this.af.authState; // observable to keep auth state. returns user.
  }

  get user() {
    return this.af.auth.currentUser;
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.af.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName,
      authenticated: true  // could be an issue.
    } 

    return userRef.set(data, { merge: true })

  }

  // returns a promise.
  // can call `.then` or async await
  createUser(email: string, password: string) {
     return this.af.auth
       .createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.af.auth
      .signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    await this.af.auth.signOut();
    this.store.unset();
    this.router.navigate(['/']);
  }
}