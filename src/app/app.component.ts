import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Store } from 'store';
import { Router } from '@angular/router';
import { AuthService } from './auth/shared/services/auth/auth.service';
import { User } from './shared/models/user.interface';
import { Subscription } from 'rxjs';
import { Poll } from './shared/models/poll.interface';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `


  <div class="wrapper">
    <app-header
      [user]="user$ | async"></app-header>
    <router-outlet></router-outlet>


    <footer [ngClass]="{'app-footer': true, 'space': footerSpace}">
    <div class="logo" *ngIf="customLogo" style="width:100px;float:left;padding:0;margin-right:15px;">
      <img style="max-width:150px;" src="/assets/images/rankit-color.svg" alt="RankIt" [routerLink]="['/']" />
</div>
      Powered by <a href="https://www.fairvote.org" target="_blank">FairVote</a>.
      <br />
      Have a question? Check out our <a href="https://fairvote.box.com/s/8cc8f9y8ddvdbcxkqlzfxkq12cnaztsf" target="_blank">User Guide</a>.
      <br />
      Problems with the app? Email <a href="mailto:rankit@fairvote.org">rankit@fairvote.org</a>.
    </footer>


  </div>



  <div id="sillyOverlay" style="z-index: 999999;bottom: 10px; left: 30px;position:fixed;" *ngIf="SILLY_OVERLAY" >
    <button type="button" (click)="checkState()">Check State</button>
</div>

  `
})
export class AppComponent implements OnInit {
  SILLY_OVERLAY = (environment.production == false) ? true : false;
  user$: Observable<User>;
  subscription: Subscription;
  customLogo: boolean = false;
  footerSpace = false;


  items: Observable<any[]>;
  constructor(
              private db: AngularFirestore,
              private router:Router,
              private authService:AuthService,
             // private analytics: FirebaseAnalytics,
              private store: Store) {
    this.items = db.collection('items').valueChanges();
  }

  ngOnInit() {
     this.subscription = this.authService.user$.subscribe();
     this.user$ = this.store.select('user');
     this.store.select('poll').subscribe((poll:Poll) => {
       if (poll && poll.customizations && poll?.customizations?.logoUrl != "") {
         this.customLogo = true;
       }
       if (poll) {
         this.footerSpace = true;
       }
     })
  }

  checkState() {
    console.log(this.store.value);
  }

  async onLogout() {
      await this.authService.signOut();
      //redirect to login
      this.router.navigate(['/auth/login']);
  }
}
