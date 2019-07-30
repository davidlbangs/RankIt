import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
// services
import { AuthService } from '../../../shared/services/auth/auth.service';


@Component({
  selector: 'login',
  template: `
    <header class="poll-header">
        <h1 class="">Sign In</h1>
        <p>
          Or Create an Account
        </p>  
      </header>
    <main class="mt-3">
      <firebase-ui
       (signInSuccessWithAuthResult)="successCallback($event)"
       (signInFailure)="errorCallback($event)"></firebase-ui>
    </main>
    

     
  `
})
export class LoginComponent implements OnInit {
  

  error: string;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit() {
    
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