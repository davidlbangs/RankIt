import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Store } from 'store';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `


  <div class="wrapper">
    <app-header
      [user]="user$ | async"></app-header>
    <router-outlet></router-outlet>

    
  </div>



  <div id="sillyOverlay" style="z-index: 999999;bottom: 10px; left: 30px;position:fixed;" *ngIf="SILLY_OVERLAY" >
    <button type="button" (click)="checkState()">Check State</button> 
</div>

  `
})
export class AppComponent implements OnInit {
  SILLY_OVERLAY = (environment.production == false) ? true : false;
  title = 'rankit';
  user$: Observable<User>;
  subscription: Subscription;
  

  
  items: Observable<any[]>;
  constructor(
              private db: AngularFirestore,
              private router:Router,
              private authService:AuthService,
              private store: Store) {
    this.items = db.collection('items').valueChanges();
  }

  ngOnInit() {
     this.subscription = this.authService.auth$.subscribe();
     this.user$ = this.store.select('user');
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
