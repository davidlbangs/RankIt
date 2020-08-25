import { Component, OnInit, ElementRef, ViewChild, QueryList, ViewChildren, ChangeDetectorRef, PLATFORM_ID, Inject, NgZone } from '@angular/core';
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
import { MetaService } from 'meta';
import { CookieService } from 'ngx-cookie-service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { isPlatformBrowser } from '@angular/common';


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
  captchaOkay = false;
  server = false;
  @ViewChildren('recaptcha') recaptchaElements: QueryList<ElementRef>;

  poll$: Observable<Poll> = this.store.select('poll');
  poll: Poll;
  is_open = false;
  stillHere = false;
  id = "";

  constructor(
              private cookie:CookieService,
              private readonly meta: MetaService,
              private http:HttpClient,
              private router:Router,
              private voteService:VoteService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private cd: ChangeDetectorRef,
              private analytics: AngularFireAnalytics,
              private route:ActivatedRoute,
              private ngZone: NgZone,
              private store:Store) {
               }
public ngAfterViewInit(): void
{
  if (this.server) {
    return;
  }
  this.recaptchaElements.changes.subscribe((comps: QueryList<ElementRef>) =>
  {
    if (this.is_open) {

      this.addRecaptchaScript(comps.first);
    }
  });
}


ngOnDestroy() {
  this.stillHere = false;
}

  ngOnInit() {
    //window['angularComponentReference'] = { component: this, zone: this.ngZone, addRecaptchaScript: (element) => this.addRecaptchaScript(element), };
    console.log("on init!");
    this.stillHere = true;
    if (isPlatformBrowser(this.platformId)) {
      console.log("starting the thread");
      this.thread();
    }
    else {
      this.server = true;
    }

    this.getIPAddress();

    let user = this.route.snapshot.data.resolverUser;

    let self = this;
    this.route.paramMap
      .subscribe((params:ParamMap) => {
        let id = params.get('id');
        self.id = id;

        if(id) {
          this.poll$ = this.voteService.getPoll(id)
          .pipe(
                tap(poll => this.limit_vote(poll, user)),
                tap(next => this.choices = this.displayChoices(next)),
                tap(next => this.meta.setTitle('Vote - ' + next.title)),
                tap(next => {
                  this.setBackButton(user, next);
                  if (next.owner_uid == user?.uid && next.is_published == false) {
                      next.is_published = true;
                    }

                    if (next.customizations?.color?.includes("#") === false) {
                      next.customizations.color = "#" + next.customizations.color;
                    }
                    if (next.customizations?.buttonColor1?.includes("#") === false) {
                      next.customizations.buttonColor1 = "#" + next.customizations.buttonColor1;
                    }
                    if (next.customizations?.barColor?.includes("#") === false) {
                      next.customizations.barColor = "#" + next.customizations.barColor;
                    }
                    if (next.customizations?.buttonColor2?.includes("#") === false) {
                      next.customizations.buttonColor2 = "#" + next.customizations.buttonColor2;
                    }
                })
                );
              
              console.log('subscription created');
        } else {
          this.router.navigate(['/vote/not-found']);
          
        }
       
      });
  }


  addRecaptchaScript(element) {
    console.log("add google captcha!");
    if (window['grecaptcha']) {
      this.renderReCaptcha(element);
    }
    window['grecaptchaCallback'] = () => {
      this.renderReCaptcha(element);
    }

    (function(d, s, id, obj){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
   
  }
  renderReCaptcha(element) {
    let self = this;
    window['grecaptcha'].render(element.nativeElement, {
      'sitekey' : '6LdzPOwUAAAAALrGEBItRBu9dJ1V3anW0Z3HaoHT',
      'callback': (response) => {
          this.http.get<any>("https://us-central1-rankit-vote.cloudfunctions.net/checkRecaptcha?response="+response).subscribe(res => {
            self.captchaOkay = res.status;
            self.cd.detectChanges();
          });
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

    this.analytics.logEvent('vote', {pollId: poll.id, poll: poll, vote: vote})
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));

    this.router.navigate(['vote', poll.id, 'success']);
  }

  addToVote(choice:Choice) {
    // console.log('add', choice);
    this.choices = this.choices.filter(obj => obj !== choice); // Remove from old.
    this.vote.choices.push(choice); // add to new.
    this.cd.detectChanges();
  }

  removeFromVote(choice:Choice) {
    this.vote.choices = this.vote.choices.filter(obj => obj !== choice);
    this.choices.push(choice);
    this.cd.detectChanges();
  }

  moveUp(choice:Choice) {
    const index = this.vote.choices.indexOf(choice);
    if (index > 0) {
      this.vote.choices = this.array_move(this.vote.choices, index, index - 1);
    }
    this.cd.detectChanges();
  }

  moveDown(choice:Choice) {
    const index = this.vote.choices.indexOf(choice);
    if (index < this.vote.choices.length) {
      this.vote.choices = this.array_move(this.vote.choices, index, index + 1);
    }
    this.cd.detectChanges();
  }

  getIPAddress() {
    this.http.get<{ip:string}>('https://jsonip.com')
      .subscribe( data => {
        this.vote.ip_address = data.ip
      })
  }

  thread() {
    if (this.stillHere) {
      let self = this;
      this.http.get<any>("https://us-central1-rankit-vote.cloudfunctions.net/checkRecaptcha?stayalive=true").subscribe(res => {
            setTimeout(function(){
              self.thread();
            },5000);
          });
    }
  }

  showVote() {
    console.log('vote', this.vote);
  }

  limit_vote(poll:Poll, user:User) {
    const alreadyVoted = this.cookie.get('rankit-' + poll.id);
    this.is_open = poll.is_open && poll.is_published;

    if (this.is_open == false && this.isPollOwner(user?.uid, poll.owner_uid)) {
      this.is_open = true;
    }

    // decide if they've voted already
    if(
       alreadyVoted &&
       poll.limit_votes/* &&
       (!user || !this.isPollOwner(user.uid, poll.owner_uid))*/
       ) {
      this.router.navigate(['/vote', poll.id, 'success']);
    }
    if (poll.is_open == false) {
      this.router.navigate(['/results', poll.id, 'summary']);
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
