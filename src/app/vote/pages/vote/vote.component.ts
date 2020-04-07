import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Store } from 'store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { AppSettings } from '../../../app.settings';

import { Poll, Vote, Choice } from '../../../shared/models/poll.interface';
import { User } from '../../../shared/models/user.interface';
import { VoteService } from '../../../shared/services/vote.service';
import { MetaService } from 'src/meta';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  LOCAL_OVERLAY = (environment.production == false) ? true : false;
  defaultText = AppSettings.defaultText;
  vote:Vote = {"ip_address": null, "choices": Array()}; // local state
  choices: Choice[];
  user$ = this.store.select('user');

  poll$: Observable<Poll> = this.store.select('poll');


  constructor(
              private cookie:CookieService,
              private readonly meta: MetaService,
              private http:HttpClient,
              private router:Router,
              private voteService:VoteService,
              private route:ActivatedRoute,
              private store:Store) {
               }

  ngOnInit() {

    this.getIPAddress();

    let user = this.route.snapshot.data.resolverUser;


    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');

        if(id) {
          this.poll$ = this.voteService.getPoll(id)
          .pipe(
                tap(poll => this.limit_vote(poll, user)),
                tap(next => this.choices = this.displayChoices(next)),
                tap(next => this.meta.setTitle('Vote - ' + next.title)),
                tap(next => {
                  this.setBackButton(user, next)
                })
                );

        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });
  }

  displayChoices(poll:Poll) {
    if(poll.randomize_order){
      return this.voteService.shuffle(poll.choices);
    }
    else {
      return poll.choices;
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    // console.log('event', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  async submitVote(poll:Poll, vote:Vote) {
    await this.voteService.submitVote(poll, vote);

    this.router.navigate(['vote', poll.id, 'success']);
  }

  addToVote(choice:Choice) {
    // console.log('add', choice);
    this.choices = this.choices.filter(obj => obj !== choice); // Remove from old.
    this.vote.choices.push(choice); // add to new.
  }

  removeFromVote(choice:Choice) {
    this.vote.choices = this.vote.choices.filter(obj => obj !== choice);
    this.choices.push(choice);
  }

  moveUp(choice:Choice) {
    const index = this.vote.choices.indexOf(choice);
    if (index > 0) {
      this.vote.choices = this.array_move(this.vote.choices, index, index - 1);
    }
  }

  moveDown(choice:Choice) {
    const index = this.vote.choices.indexOf(choice);
    if (index < this.vote.choices.length) {
      this.vote.choices = this.array_move(this.vote.choices, index, index + 1);
    }
  }

  getIPAddress() {
    this.http.get<{ip:string}>('https://jsonip.com')
      .subscribe( data => {
        this.vote.ip_address = data.ip
      })
  }

  showVote() {
    console.log('vote', this.vote);
  }

  limit_vote(poll:Poll, user:User) {
    const alreadyVoted = this.cookie.get('rankit-' + poll.id);

    // decide if they've voted already
    if(
       alreadyVoted &&
       poll.limit_votes &&
       (!user || !this.isPollOwner(user.uid, poll.owner_uid))
       ) {
      this.router.navigate(['/vote', poll.id, 'success']);
    }
  }

  isPollOwner(uid, poll_owner) {
    return (uid === poll_owner);
  }

  setBackButton(user, poll:Poll) {
    if(user && this.isPollOwner(user.uid, poll.owner_uid)) {
      this.store.set('backButton', ['/polls/', poll.id]);
    } else {
      this.store.set('backButton', `/`);
    }
  }


 array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

}
