import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router} from '@angular/router';

// services
import { AuthService } from '../../../shared/services/auth/auth.service';


@Component({
  selector: 'login',
  template: `
    <div class=""> 
      <auth-form (submitted)="loginUser($event)">
        <h1>Login</h1>
        <a routerLink="/auth/register">Not Registered?</a>
        <button type="submit">Login</button>
        <div class="error" *ngIf="error">
          {{ error }}          
        </div>
      </auth-form>
    </div>
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

  // uses async await.
  async loginUser(event: FormGroup) {
      const { email, password } = event.value; // destructuring
      
      try {
        await this.authService.loginUser(email, password);
        // this is the "done" section of the promise.
        this.router.navigate(['/']);
      } catch (err) {
        this.error = err.message;
      }

      
  }
}