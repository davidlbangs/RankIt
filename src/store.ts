
import {pluck, distinctUntilChanged } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import "rxjs/add/operator/pluck";

// models
import { Poll } from './app/shared/models/poll.interface';
// import { Post } from './app/shared/models/post.interface';
// import { Topic, ChatThread } from './app/shared/models/chat.interface';
// import { Tenet } from './app/shared/models/tenet.interface';
// import { UserMeta, FirebaseUser } from './app/shared/models/person.interface';
import { User } from './auth/shared/services/auth/auth.service';

// import { Cookie } from './models/cookie.interface';

export interface State {
  isOpen: boolean,
  poll:Poll,
  polls: Poll[],
  publicPolls: Poll[],
  backButton: string
  // activeThread: ChatThread,
  // chatThreads: ChatThread[],
  // post:Post,
  // posts:Post[],
  // date: Date,
  // selected: any,
  // list: any,
  user: User,
  // userMeta: any,
  // tenet:string,
  // tenetMeta: Tenet,
  // topics: Topic[]
  // users:UserMeta[]
}

const state: State = {
  isOpen: undefined,
  poll: undefined,
  polls: undefined,
  publicPolls: undefined,
  backButton: undefined,
  user: undefined,
  // chatThreads: undefined,
  // activeThread: undefined,
  // post:undefined,
  // posts:undefined,
  // date: undefined,
  // selected: undefined,
  // list: undefined,
  // userMeta: undefined,
  // tenet: undefined,
  // tenetMeta: undefined,
  // topics: undefined,
  // users: undefined
};

export class Store {

  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged()); // needs .distinctUntilChanged()

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }

  unset() {
    this.subject.next(state);
  }

}
