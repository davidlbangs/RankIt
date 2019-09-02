import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../../shared/models/user.interface';
import { PollService } from '../../../shared/services/poll.service';
import { Store } from 'store';

@Component({
  selector: 'app-manage-users',
  template: `
    <main>
      <h1 class="mb-1 mt-2"><strong>Admin:</strong> Manage All Users</h1>
      <p class="description mb-2">Go to Firebase <a href="https://console.firebase.google.com/u/0/project/rankit-vote/authentication/users" target=_BLANK>Console</a> to block a user.</p>
      <hr class="mb-2" />
    <div *ngIf="users$ | async as users; else loading;" class="pb-4">

        <mat-card *ngFor="let user of users" [routerLink]="['/admin/polls-by-user/', user.uid]" class="mb-1 linked-card">
        <mat-card-title>{{user.email}}</mat-card-title>
        <mat-card-subtitle>{{ user.roles.admin ? 'Admin' : ''}}</mat-card-subtitle>
     

        <mat-card *ngIf="users.length == 0">
          <mat-card-title>No users yet! How about making one?</mat-card-title>
        </mat-card>
      </mat-card>
        
    </div>

    <ng-template #loading>
      <div class="message">
        <img src="/assets/images/loading.svg" alt="" />
        Fetching users...
      </div>
    </ng-template>
    </main>
  `,
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  
  users$: Observable<User[]>;
  // subscription: Subscription;
  constructor(
              private store: Store, 
              private db: AngularFirestore, 
              private pollService:PollService) {}

  ngOnInit() {
    this.store.set('backButton', 'account');
    this.users$ = this.db.collection<User>('users').valueChanges();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
