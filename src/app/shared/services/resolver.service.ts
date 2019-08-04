// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap, first} from 'rxjs/operators';

// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AuthService } from '../../auth/shared/services/auth/auth.service';
import { Store } from 'store';

// import { UserMeta } from '../../shared/models/person.interface';

@Injectable()
export class UserResolver implements Resolve<any> {

  constructor(
    private auth:AngularFireAuth,
    private store:Store
    ) { }

  resolve(): Observable<any> {
    return this.auth.authState.pipe(first());
    // let state = return this.afAuth.authState.pipe(first());
    // console.log('state is ', state);

    // return of(true);
    // return this.db.doc<UserMeta>(`users/${this.uid}`).valueChanges().do(next => {
    //   console.log('made it here', next);
    //   this.store.set('userMeta', next);
    //   this.store.set('tenet', next.tenets[0]);
    // });



    // return this.db.doc<UserMeta>(`users/${this.uid}`).valueChanges().pipe(
    //     take(1),
    //     tap(next => {
    //         this.store.set('userMeta', next);
    //         this.store.set('tenet', next.tenets[0]);
    //       }
    //   )
    // );

  }
}