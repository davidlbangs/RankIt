import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import {Store } from 'store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { AppSettings } from '../../../app.settings';

import { Poll, Vote, Choice } from '../../../shared/models/poll.interface';

import { VoteService } from '../../../shared/services/vote.service';

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
              private http:HttpClient,
              private router:Router,
              private voteService:VoteService,
              private route:ActivatedRoute,
              private store:Store) {
               }

  ngOnInit() {

    this.getIPAddress();

    if(this.uid) {
      this.store.set('backButton', 'polls');
    }

    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');
        // console.log(params);
        if(id) {
          this.poll$ = this.voteService.getPoll(id)
          .pipe(
                tap(next => this.choices = this.displayChoices(next)));
        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });


  }

  
  get uid() {
    if(this.store.value.user) {
      return this.store.value.user.uid;
    }
    else return null;
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

  submitVote(poll:Poll, vote:Vote) {
    this.voteService.submitVote(poll, vote);
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
