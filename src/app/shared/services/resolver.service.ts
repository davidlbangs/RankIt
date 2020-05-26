// import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap, first} from 'rxjs/operators';

// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AuthService } from '../../auth/shared/services/auth/auth.service';
import { Store } from 'store';
import { isPlatformBrowser } from '@angular/common';
import 'rxjs/add/observable/empty';

// import { User } from '../../shared/models/user.interface';

@Injectable()
export class UserResolver implements Resolve<any> {

  constructor(
    private auth:AngularFireAuth,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store:Store
    ) { }

  resolve() {
    console.log("checking for user2");
    //console.log("Auth: ", this.auth);
    
    if (isPlatformBrowser(this.platformId)) {
      let r = this.auth.authState.pipe(first());
      console.log("Res: ", r);
      return r;
    }
    else {
      console.log("returning null");
      return null;
      /*
      console.log("returning empty");
      const observable = Observable.create(observer => {

        observer.next(null);
        observer.complete();
      });
    
      return observable;*/
//      return Observable.empty();
    }
    
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