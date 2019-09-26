import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '../../../../store';
import { PlatformService } from '@trilon/ng-universal';
import {AuthProvider} from 'ngx-auth-firebaseui';


@Component({
  selector: 'login',
  styleUrls: ['login.component.scss'],
  template: `

    <main class="mt-3" *ngIf="!(user$ | async); else signedIn">
      <div *ngIf="isBrowser" class="pb-5 login-component">
          <ngx-auth-firebaseui
            (onSuccess)="successCallback($event)"
            (onError)="errorCallback($event)"
            [guestEnabled]="false"
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
export class LoginComponent implements OnInit {

  error: string;
  isBrowser:boolean;
  providers = AuthProvider;

  user$: Observable<any>;

  constructor(
              private store:Store,
              private authService: AuthService,
              private router: Router,
              private platformService:PlatformService
    ) {
    this.isBrowser = platformService.isBrowser;
  }

  ngOnInit() {
    this.user$ = this.store.select('user');
  }

  successCallback(signInSuccessData: any) {
    // console.log('signed in', signInSuccessData);
    this.router.navigate(['/polls']);
  }

  errorCallback(errorData: any) {
      console.error('something went wrong', errorData);
  }  
}