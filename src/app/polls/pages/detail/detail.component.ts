import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../auth/shared/services/auth/auth.service';

import { Poll, Vote } from '../../../shared/models/poll.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';
import { MetaService } from 'meta';
import { query } from '@angular/animations';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-detail',
  styleUrls: ['./detail.component.scss'],
  template: ` 

    <div class="detail" *ngIf="poll$ | async as poll">
      <header class="poll-header">
        <h1 class="">{{ poll.title }}</h1>
        <p>
          <span *ngFor="let choice of poll.choices; let i = index">
            {{ (i + 1) < poll.choices.length ? choice + ', ' : choice }}
            
          </span>
        </p>  
        <p *ngIf="poll.winner_count > 1">
          ({{poll.winner_count}} Winners)
        </p>
      </header>
      <main class="mb-3">
      <div class="mobileColumn">
        <div class="card promo-votes mt-2 mb-2">
          <div class="label"><p>Voters</p></div>
          <div class="count"><h1>{{poll.vote_count}}</h1></div>
        </div>

        <mat-card class="mb-2">
          <mat-slide-toggle [checked]="poll.is_open" (click)="toggleOpen(poll)">
            {{poll.is_open ? 'Open, Accepting Votes' : 'Closed, Not Accepting Votes'}}
          </mat-slide-toggle>

          <p *ngIf="poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until you close it.</p>
          <p *ngIf="!poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until {{poll.length.end_time | date : 'long'}}</p>
        </mat-card>

        <mat-card class="mb-2">
          <mat-slide-toggle [checked]="poll.results_public" (click)="toggleResultsPublic(poll)">
            {{poll.results_public ? 'Show results publicly' : 'Do not show results publicly'}}
          </mat-slide-toggle>

          <!-- p *ngIf="poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until you close it.</p>
          <p *ngIf="!poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until {{poll.length.end_time | date : 'long'}}</p-->
        </mat-card>

        <mat-card class="mb-2" *ngIf="canPromotePoll()">
          <mat-slide-toggle [checked]="poll.is_promoted" (click)="togglePromoted(poll)">
            {{poll.is_promoted ? 'Promoted' : 'Not Promoted'}}
          </mat-slide-toggle>

          <p *ngIf="poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until you close it.</p>
          <p *ngIf="!poll.keep_open && poll.is_open" class="explainer mt-1">Poll will stay open until {{poll.length.end_time | date : 'long'}}</p>
        </mat-card>

        </div>

      <div class="mobileColumn right" style="padding-top:25px;">
        <button *ngIf="!poll.results_public"
          [routerLink]="['/results', poll.id, 'summary']" 
          mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large">View Results (only you can view)</button>
        <button *ngIf="poll.results_public"
          [routerLink]="['/results', poll.id, 'summary']" 
          mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-signal"></i>View Results</button>
        <button [routerLink]="['/vote', poll.id]"
          [disabled]="!poll.is_open"
        mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-pencil"></i>Vote on this Poll</button>
        <button (click)="csv()"
          [disabled]="poll.is_open || poll.vote_count == 0"
        mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-table"></i>Download Results (CSV)</button>
        <button (click)="json()"
        [disabled]="poll.is_open || poll.vote_count == 0"
      mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large"><i class="fa fa-table"></i>Download Results (JSON)</button>
      
        <hr class="mt-3 mb-4" />
        <h1 class="mb-1">Promote Poll</h1>
        <p *ngIf="!poll.is_published">This poll cannot be shared until it is published.</p>
        <share-poll *ngIf="poll.is_published" [poll]="poll"></share-poll>
        <embed-poll *ngIf="poll.is_published" [poll]="poll"></embed-poll>
        
        </div>
        <div class="clear"></div>
      </main>

      <hr class="mb-3" />

      <main class="pb-3">
      <!-- <button *ngIf="poll.is_published" (click)="togglePublished(poll)" mat-stroked-button color="red" class="has-icon">Unpublish Poll</button> -->
      <button style="margin-right:15px;" *ngIf="!poll.is_published" (click)="togglePublished(poll)" mat-stroked-button color="red" class="has-icon">Publish Poll</button>
     
      <button (click)="toggleDelete()" mat-stroked-button color="red" class="has-icon"><i class="fa fa-times"></i>Delete Poll</button>
      <div class="confirmDelete" *ngIf="showDelete">
        Are you sure? <button mat-raised-button color="warn" (click)="deletePoll(poll)">Delete</button> <button mat-button (click)="toggleDelete()">Cancel</button>
      </div>
      </main>
    </div>

    

  `
})

export class DetailComponent implements OnInit {

  poll$: Observable<any>; // should be poll
  subscription: Subscription;
  currentPoll: Poll;
  showDelete:boolean = false;

  constructor(
              private auth: AuthService,
              private readonly meta: MetaService,
              private pollService: PollService,
              private router:Router,
              private store:Store,
              private db: AngularFirestore, 
              private route:ActivatedRoute) {}


  ngOnInit() {
    this.store.set('backButton', 'polls');
    this.subscription = this.pollService.getUserPolls().subscribe();
    
    this.poll$ = this.route.params
    .pipe(
          switchMap(param => {
            const poll = this.pollService.getPoll(param.id);
            return poll;
          }),
          tap(next => this.meta.setTitle(next.title)),
          tap(next => this.currentPoll = next )
          );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async deletePoll(poll:Poll) {
    await this.pollService.deletePoll(poll);

    this.router.navigate(['/polls']);
  }

  toggleOpen(poll:Poll) {
    this.pollService.togglePollOpen(poll.id, poll.is_open);
  }

  toggleResultsPublic(poll:Poll) {
    this.pollService.togglePollResultsPublic(poll.id, poll.results_public);
  }

  togglePromoted(poll:Poll) {
    this.pollService.togglePollPromoted(poll.id, poll.is_promoted);
  }

  togglePublished(poll:Poll) {
    if (confirm('Are you sure? Once you publish a poll others will be able to see it and vote on it until you close the poll.')) {
      this.pollService.togglePollPublished(poll.id, poll.is_published);
    }
  }


ConvertToCSV(objArray, headerList) { 
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray; 
  let str = ''; 
  let row = ''; 
  for (let index in headerList) { 
      row += headerList[index] + ','; 
  } 
  row = row.slice(0, -1); 
  str += row + '\r\n'; 
  for (let i = 0; i < array.length; i++) { 
      let line = ""; 
      for (let index in headerList) { 
          //let head = headerList[index]; 
          line += ", " + array[i][index]; 
      } 
      line = line.slice(2);
      str += line + "\r\n"; 
  } 
  return str; 
} 

json() {
  console.log("a: ", this.currentPoll);
  let pollID = this.currentPoll.id;
    const votesRef = this.db.collection(`polls/${pollID}/votes`).valueChanges();
    let l = this.currentPoll.choices.length;
    votesRef.subscribe((data2:Vote[]) => {
      var date = new Date(this.currentPoll.date_created * 1000);

var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
      let rounds = [];
      for (var i = 0; i < this.currentPoll.results.elected.length; i++) {
        let roundData = this.currentPoll.results.rounds[i];
        let tallyResults = {};
        tallyResults["elected"] = this.currentPoll.results.elected[i];
        for (let elim of this.currentPoll.results.eleminated) {
          if (elim.round == (i+1)) {
            tallyResults["eliminated"] = [elim.name];
          }
        }
        let round = {
          "round" : (i+1),
          "tally" : roundData,
          "tallyResults" : [tallyResults]
        };
        rounds.push(round);
      }
        let ret = {
          "config" : {
            "contest" : this.currentPoll.title,
            "date" : year + "-" + month + "-" + day,
            "jurisdiction" : "",
            "office" : "",
            "threshold" : this.currentPoll.results.threshold
          },
          "results": rounds
        };
        let filename = "results";
    let blob = new Blob(['\ufeff' + JSON.stringify(ret)], { 
        type: 'application/json;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser = navigator.userAgent.indexOf( 
      'Safari') != -1 &&
    navigator.userAgent.indexOf('Chrome') == -1; 
    
    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download", filename + ".json"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink);
    });
}
  csv() {
    let pollID = this.currentPoll.id;
    const votesRef = this.db.collection(`polls/${pollID}/votes`).valueChanges();
    let headlines = [];
    let l = this.currentPoll.choices.length;
    for (var i = 0; i < l; i++) {
      headlines.push("Choice " + (i+1));
    }
    headlines.push("createdAt");
    // 1. Get Poll
    // 2. get All Votes
   votesRef.subscribe((data2:Vote[]) => {
    let data = [];
    for (let d of data2) {
      console.log("this: ", d);
      var e = [];
      for (var i = 0; i < l; i++) {
        if (d.choices[i]) {
          e.push(d.choices[i]);
        }
        else {
          e.push("");
        }
      }
      e.push(d.date_created);
      data.push(e);
    }
          
console.log("data: ", data);
  

    let filename = "results";
    console.log("csv: ", this.currentPoll.votes);
    let csvData = this.ConvertToCSV(data, headlines); 
    console.log(csvData) 
    let blob = new Blob(['\ufeff' + csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser = navigator.userAgent.indexOf( 
      'Safari') != -1 &&
    navigator.userAgent.indexOf('Chrome') == -1; 
    
    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download", filename + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
    console.log("qu: ", data);
  });
  }

  toggleDelete() {
    this.showDelete = !this.showDelete;
  }

  canPromotePoll() {
    const user = this.store.value.user;
    return this.auth.canPromotePoll(user);
  }

}
