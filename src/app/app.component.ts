import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Store } from 'store';
import { Router } from '@angular/router';
import { AuthService } from './auth/shared/services/auth/auth.service';
import { User } from './shared/models/user.interface';
import { Subscription } from 'rxjs';
import { FirebaseAnalytics } from '@angular/fire';
import { Poll } from './shared/models/poll.interface';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `


  <div class="wrapper">
    <app-header
      [user]="user$ | async"></app-header>
    <router-outlet></router-outlet>


    <footer class="app-footer">
    <div class="logo" *ngIf="customLogo">
      <img style="max-width:150px;" src="/assets/images/rankit-color.svg" alt="RankIt" [routerLink]="['/']" />
</div>
      Powered by <a href="https://www.fairvote.org">FairVote</a>.<br />Problems with the app? Email <a href="mailto:rankit@fairvote.org">rankit@fairvote.org</a>.
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
       if (poll?.customizations?.logoUrl != "") {
         //this.customLogo = true;
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
