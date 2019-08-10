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

    <div class="" *ngIf="poll$ | async as poll; else loading;">
      <poll-form
        [poll]="poll"
        (create)="addPoll($event)"
        (update)="updatePoll($event)"
        (remove)="removePoll($event)">
      </poll-form>
    </div>

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
  subscription: Subscription;

  constructor(
              private store:Store,
    private pollService: PollService,
    private router:Router,
    private route:ActivatedRoute) {}


  ngOnInit() {
    this.store.set('backButton', 'polls');
    this.subscription = this.pollService.getUserPolls().subscribe();
    
    this.poll$ = this.route.params
    .pipe(
          switchMap(params => {
              // console.log(param);
              // let blah:Poll = this.pollService.getPoll(param.id);
              // console.log(blah);
              // return blah;

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

  async addPoll(event: Poll) {
    let newPollID = await this.pollService.addPoll(event);

    console.log('poll added', newPollID);

    this.router.navigate(['polls', newPollID]);

  }

  async updatePoll(event: Poll) {
    // snapshot takes out of stream.
    // id is used to get, above.
    // CANT use event.$key because it's the form value, and there's no key.
    const key = this.route.snapshot.params.id;
    await this.pollService.updatePoll(key, event);
  }

  async removePoll(event: Poll) {
    const key = this.route.snapshot.params.id;
     await this.pollService.deletePoll(key);
  }

  backToPolls() {
    this.router.navigate(['polls']);
  }
}