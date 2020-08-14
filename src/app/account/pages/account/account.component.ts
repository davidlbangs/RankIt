import { Component, OnInit } from '@angular/core';
import { Store } from 'store';

import { Router } from '@angular/router';

import { AuthService } from '../../../auth/shared/services/auth/auth.service';

@Component({
  selector: 'app-account',
  styleUrls: ['./account.component.scss'],
  template: `

   <header class="poll-header">
      <h1 class="">Account</h1> 
    </header>

    <main *ngIf="user$ | async as user;">

          <h3 class=" mt-2 mb-1">
            Email Address            
          </h3>
          <p class="explainer mb-1">The email address on an account cannot be changed.</p>
          
          <mat-form-field appearance="outline" floatLabel="never" style="width:100%;">
            <input matInput placeholder="" [value]="user.email" disabled>
          </mat-form-field>

          <div class="admin mb-3" *ngIf="user.roles?.admin">
            <h3 class="mt-2 mb-1">Admin</h3>
            <button (click)="toAdmin('manage-polls')" mat-stroked-button [color]="'accent'" class="has-icon mr-1"><i class="fa fa-rocket"></i>Manage Polls</button>
            <button (click)="toAdmin('manage-users')" mat-stroked-button [color]="'accent'" class="has-icon"><i class="fa fa-rocket"></i>Manage Users</button>
          </div>

        <!--<h3>Password</h3>
        <a routerLink="/account/password">Change Password</a>-->

        <hr class="mb-2" />
        <button (click)="logout()" mat-stroked-button color="red" class="has-icon"><i class="fa fa-sign-out"></i>Log Out</button>

    </main>

  `,
})
export class AccountComponent implements OnInit {

  user$ = this.store.select('user');

  constructor(
              private router: Router,
              private authService: AuthService,
              private store:Store) { }

  ngOnInit() {
    this.store.set('backButton', 'polls');
  }

  logout() {
    this.authService.signOut();
  }

  toAdmin(route?: string) {
    this.router.navigate(['/admin', route]);
  }

}
