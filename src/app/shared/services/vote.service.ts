import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { Store } from 'store';
import { Poll, Vote } from '../models/poll.interface';




@Injectable({
  providedIn: 'root'
})
export class VoteService {


  constructor(
    private router: Router,
    private cookie: CookieService,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object,
    private db: AngularFirestore) { }



  getPoll(id: string): Observable<Poll> {
    this.db.firestore.enableNetwork();
    return this.db.doc<Poll>(`polls/${id}`).valueChanges()
      .pipe(
        first(),
        tap({
          next: val => {
            // redirect out if we didn't find anything.
            if (val === undefined) {
              this.router.navigate(['/home/not-found']);
            }
            this.store.set('poll', val);
            if (isPlatformBrowser(this.platformId)) {
            } else {
              this.db.firestore.disableNetwork();
            }

            return val;
          }
        })
      );
  }

  hasVoted(poll: Poll) {
    return this.cookie.get('rankit-' + poll.id) === 'voted' || this.cookie.get('rankit1-' + poll.id) === 'voted';
  }

  submitVote(poll: Poll, vote: Vote) {
    // console.log('submit', poll, vote);

    if (poll.limit_votes) {
      this.cookie.set('rankit-' + poll.id, 'voted', 365);
    }
    this.cookie.set('rankit1-' + poll.id, 'voted', 365);

    vote.id = this.db.createId();
    vote.date_created = Date.now();
    return this.db.doc<Vote>(`polls/${poll.id}/votes/${vote.id}`).set(vote);
  }



  shuffle(arr) {
    let i,
      j,
      temp;
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }


}
