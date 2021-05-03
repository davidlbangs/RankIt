import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from 'store';
import { Poll } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';


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
    private store: Store,
    private pollService: PollService,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.user$ = this.store.select<any>('user');
    this.store.set('backButton', 'polls');
    this.subscription = this.pollService.getUserPolls().subscribe();

    this.poll$ = this.route.params
      .pipe(
        switchMap(params => {

          const id = params.id;
          if (id) {
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
    const newPollID = await this.pollService.addPoll(event, publish);

    if (publish) {
      if (confirm('Click "OK" to show your results immediately after each vote. Click "Cancel" to hide them from voters until you close the poll.')) {
        event.results_public = false;
        this.pollService.togglePollResultsPublic(event.id, event.results_public);
        alert('Your poll is published and ready to share. Voters will see results after they submit their vote.');
      } else {
        event.results_public = true;
        this.pollService.togglePollResultsPublic(event.id, event.results_public);
        alert('Your poll is published and ready to share. Voters will not see results until/unless you choose to display them in your settings.');
      }
    }

    this.router.navigate(['polls', newPollID]);

  }

  async updatePoll(event: Poll, publish) {
    // snapshot takes out of stream.
    // id is used to get, above.
    // CANT use event.$key because it's the form value, and there's no key.
    const key = this.route.snapshot.params.id;

    await this.pollService.updatePoll(key, event, publish);

    if (publish) {
      if (confirm('Click "OK" to show your results immediately after each vote. Click "Cancel" to hide them from voters until you close the poll.')) {
        event.results_public = false;
        this.pollService.togglePollResultsPublic(key, event.results_public);
        alert('Your poll is published and ready to share. Voters will see results after they submit their vote.');
      } else {
        event.results_public = true;
        this.pollService.togglePollResultsPublic(key, event.results_public);
        alert('Your poll is published and ready to share. Voters will not see results until/unless you choose to display them in your settings.');
      }
    }

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
