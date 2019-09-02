import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
// services
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '../../../../store';

@Component({
  selector: 'login',
  template: `
    <header class="poll-header">
        <h1 class="">Sign In</h1>
        <p>
          Or Create an Account
        </p>  
      </header>
    <main class="mt-3" *ngIf="!(user$ | async); else signedIn">
      
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

  user$: Observable<any>;

  constructor(
              private store:Store,
    private authService: AuthService,
    private router: Router
    ) {}

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

  // async loginUser(event: FormGroup) {
  //     const { email, password } = event.value; // destructuring
      
  //     try {
  //       await this.authService.loginUser(email, password);
  //       // this is the "done" section of the promise.
  //       this.router.navigate(['/']);
  //     } catch (err) {
  //       this.error = err.message;
  //     }   
  // }
}