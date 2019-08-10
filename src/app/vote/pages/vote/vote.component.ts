import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Store } from 'store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { AppSettings } from '../../../app.settings';

import { Poll, Vote, Choice } from '../../../shared/models/poll.interface';
import { VoteService } from '../../../shared/services/vote.service';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

  defaultText = AppSettings.defaultText;
  vote:Vote = {"ip_address": null, "choices": Array()}; // local state
  choices: Choice[];
  user$ = this.store.select('user');

  poll$: Observable<Poll> = this.store.select('poll');


  constructor(
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
        // console.log(params);
        if(id) {
          this.poll$ = this.voteService.getPoll(id)
          .pipe(
                tap(next => this.choices = this.displayChoices(next)),
                tap(next => this.meta.setTitle('Vote – ' + next.title)));

          if(user) {
            this.store.set('backButton', ['/polls/', id]);
          } else {
            this.store.set('backButton', `/`);
          }

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
    console.log('event', event);
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
    console.log(choice);
    this.choices = this.choices.filter(obj => obj !== choice); // Remove from old.
    this.vote.choices.push(choice); // add to new.
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

}
