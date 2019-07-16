import { Component, OnInit } from '@angular/core';
import { Store } from 'store';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

@Component({
  selector: 'app-account',
  styleUrls: ['./account.component.scss'],
  template: `

    <main class="poll">
        <div class="poll__title">
          <h1 class="mb-2 mt-2">
            
            <span *ngIf="user$ | async as user; else title;">
                Account
              </span>
              <ng-template #title>
                Loading...
              </ng-template>
          </h1>
          <hr class="mb-2" />
        </div>

        <hr class="mb-2" />

        <h3>Password</h3>
        <a routerLink="/account/password">Change Password</a>

        <hr class="mb-2" />

        <a (click)="logout()">Log Out</a>

    </main>

  `,
})
export class AccountComponent implements OnInit {

  user$ = this.store.select('user');

  constructor(
              private authService: AuthService,
              private store:Store) { }

  ngOnInit() {
    this.store.set('backButton', 'polls');
  }

  logout() {
    this.authService.signOut();
  }

}
