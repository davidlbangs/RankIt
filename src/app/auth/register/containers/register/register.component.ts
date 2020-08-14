import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Store } from 'store';
// import { PlatformService } from '@trilon/ng-universal';
import {AuthProvider} from 'ngx-auth-firebaseui';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'register',
  template: `

    <main class="mt-3" *ngIf="!(user$ | async); else signedIn">
      <div *ngIf="isBrowser" class="login-component">
          <ngx-auth-firebaseui
            (onSuccess)="successCallback($event)"
            (onError)="errorCallback($event)"
            [tabindex]="'1'"
            [guestEnabled]="'false'"
            [providers]="[providers.Google, providers.Facebook, providers.Twitter]">
            </ngx-auth-firebaseui>
       </div>
    </main>
    
    <ng-template #signedIn>
    <main>
      <p class="mt-2 mb-1">You're already signed in.</p>

      <p><a [routerLink]="['/polls']">Back to My Account</a>


    </main>
    </ng-template>

    
  `
})
export class RegisterComponent implements OnInit {
  
  error: string;
  providers = AuthProvider;
  isBrowser:boolean;
  user$: Observable<any>;

  constructor(
              private store:Store,
              private authService: AuthService,
              private router: Router,
              private analytics: AngularFireAnalytics,
             // private platformService:PlatformService
    ) {
    this.isBrowser = true; // platformService.isBrowser;
  }


  ngOnInit() {
    this.user$ = this.store.select('user');
    this.store.select('user').subscribe(res => {
      console.log("result: ", res);
    });
  }

  successCallback(signInSuccessData: any) {
    // console.log('signed in', signInSuccessData);
    //this.router.navigate(['/polls']);
    console.log("data: ", signInSuccessData);
    //this.analytics.logEvent('vote', {pollId: poll.id})
  }

  errorCallback(errorData: any) {
      console.error('something went wrong', errorData);
  } 

  // async registerUser(event: FormGroup) {
  //     const { email, password } = event.value; // destructuring
      
  //     try {
  //       await this.authService.createUser(email, password);
  //       // this is the "done" section of the promise.
  //       this.router.navigate(['/']);
  //     } catch (err) {
  //       this.error = err.message;
  //     }
  // }




}





