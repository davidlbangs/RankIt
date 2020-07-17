import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Observable, Subscription} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from 'store';

import { PollService } from '../../../shared/services/poll.service';
import { Poll } from '../../../shared/models/poll.interface';

@Component({
  selector: 'edit-poll',
  styleUrls: ['edit.component.scss'],
  template: `
    <main class="poll">
    <div class="poll__title">
      <h1 class="mb-2 mt-2">
        
        <span *ngIf="poll$ | async as poll; else title;">
            {{ poll.title ? 'Edit' : 'Create' }} poll
          </span>
          <ng-template #title>
            Loading...
          </ng-template>
      </h1>
      <hr class="mb-2" />
    </div>
    <ng-container *ngIf="user$ | async as user else loading">
    <div class="" *ngIf="poll$ | async as poll else loading">
      <poll-form
        [poll]="poll"
        [user]="user"
        (create)="addPoll($event, false)"
        (createPublish)="addPoll($event, true)"
        (updatePublish)="updatePoll($event, true)"
        (update)="updatePoll($event, false)"
        (remove)="removePoll($event)">
      </poll-form>
    </div>
    </ng-container>

    <ng-template #loading>
      <div class="message">
        <img src="/img/loading.svg" alt="" />
        Fetching poll...
      </div>
    </ng-template>
    </main>

  `
})
export class EditComponent implements OnInit, OnDestroy {
  
  poll$: Observable<Poll | {}>; // should be poll
  user$: Observable<any>;
  subscription: Subscription;

  constructor(
              private store:Store,
    private pollService: PollService,
    private router:Router,
    private route:ActivatedRoute) {}


  ngOnInit() {
    this.user$ = this.store.select<any>('user');
    this.store.set('backButton', 'polls');
    this.subscription = this.pollService.getUserPolls().subscribe();

    this.poll$ = this.route.params
    .pipe(
          switchMap(params => {

              let id = params.id;
              if(id) {
                return this.pollService.getPoll(id);
              } else {
                // ADD CREATE LOGIC
                return this.pollService.initializePoll();
              }
            })
          );
  }
  ngOnDestroy() {
     this.subscription.unsubscribe();
  }

  async addPoll(event: Poll, publish: boolean) {
    let newPollID = await this.pollService.addPoll(event, publish);

    console.log('poll added', newPollID);

    this.router.navigate(['polls', newPollID]);

  }

  async updatePoll(event: Poll, publish) {
    // snapshot takes out of stream.
    // id is used to get, above.
    // CANT use event.$key because it's the form value, and there's no key.
    const key = this.route.snapshot.params.id;
    await this.pollService.updatePoll(key, event, publish);
    this.router.navigate(['polls', key]);
  }

  async removePoll(event: Poll) {
    const key = this.route.snapshot.params.id;
     await this.pollService.deletePoll(key);
  }

  backToPolls() {
    this.router.navigate(['polls']);
  }
}