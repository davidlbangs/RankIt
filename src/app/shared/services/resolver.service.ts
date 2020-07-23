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
    
    if (isPlatformBrowser(this.platformId)) {
      let r = this.auth.authState.pipe(first());
      return r;
    }
    else {
      return null;
     
    }
  }
}