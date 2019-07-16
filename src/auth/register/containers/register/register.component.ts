import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { FormGroup } from '@angular/forms';

// services
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'register',
  template: `
    <div class="">
      <auth-form (submitted)="registerUser($event)">
      <h1>Register</h1>
        <a routerLink="/auth/login">Already have an account?</a>
        <button type="submit">Create Account</button>

        <button (click)="googleSignIn()">
        <i class="fa fa-google"></i> Connect Google
    </button>

        <div class="error" *ngIf="error">
          {{ error }}          
        </div>
    </auth-form>
    </div>

    
  `
})
export class RegisterComponent implements OnInit {
  
  error: string;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}


  ngOnInit() {
    
  }

  // uses async await.
  async registerUser(event: FormGroup) {
      const { email, password } = event.value; // destructuring
      
      try {
        await this.authService.createUser(email, password);
        // this is the "done" section of the promise.
        this.router.navigate(['/']);
      } catch (err) {
        this.error = err.message;
      }
  }

  async googleSignIn() {
    await this.authService.googleSignin();

    this.router.navigate(['/']);
  }
}





