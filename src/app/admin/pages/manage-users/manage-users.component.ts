import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from 'store';
import { User } from '../../../shared/models/user.interface';
import { AdminService } from '../../../shared/services/admin.service';
import { PollService } from '../../../shared/services/poll.service';


@Component({
  selector: 'app-manage-users',
  template: `
    <main>
      <h1 class="mb-1 mt-2"><strong>Admin:</strong> Manage All Users</h1>
      <button (click)="emails()" mat-raised-button color="primary" class="d-block mb-2 has-icon dark-icon button-large">Download email addresses (CSV)</button>
      <p class="description mb-2">Go to Firebase <a href="https://console.firebase.google.com/u/0/project/rankit-vote/authentication/users" target=_BLANK>Console</a> to block a user.</p>
      <hr class="mb-2" />
    <div *ngIf="users$ | async as users; else loading;" class="pb-4">

        <mat-card *ngFor="let user of users" class="mb-1 linked-card">
        <mat-card-title>{{user.email}} {{ user.roles?.admin ? ' (Admin)' : ''}}</mat-card-title>
        <mat-card-subtitle>
        <a [routerLink]="['/admin/polls-by-user/', user.uid]">See User polls</a> |
        <a (click)="toggleUserAdmin(user.uid, false)" *ngIf="user.roles?.admin">Remove Admin Rights</a>
        <a (click)="toggleUserAdmin(user.uid, true)" *ngIf="!user.roles?.admin">Give Admin Rights</a> |
        <a (click)="toggleUserSuper(user.uid, false)" *ngIf="user.roles?.super">Remove Super User Rights</a>
        <a (click)="toggleUserSuper(user.uid, true)" *ngIf="!user.roles?.super">Give Super User Rights</a>
        </mat-card-subtitle>
     

        <mat-card *ngIf="users.length == 0">
          <mat-card-title>No users yet! How about making one?</mat-card-title>
        </mat-card>
      </mat-card>
      <button *ngIf="more"  
      mat-button 
      class="d-block has-icon dark-icon button-large p-1" (click)="load()()">More Results</button>
      <button *ngIf="more"  
      mat-button 
      class="d-block has-icon dark-icon button-large p-1" (click)="reset()">Reset</button>
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
  more = false;
  lastResponse;
  userList = [];
  // subscription: Subscription;
  constructor(
    private store: Store,
    private db: AngularFirestore,
    private adminService: AdminService,
    private pollService: PollService) { }

  ngOnInit() {
    this.store.set('backButton', 'account');
    this.load();

    this.users$.subscribe(userList => {
      this.userList = userList;
    });
  }
  reset() {
    this.lastResponse = false;
    this.load();
  }
  load() {
    this.users$ = this.db.collection('users', ref => {
      let r = ref.limit(50);
      if (this.lastResponse) {
        r = r.startAfter(this.lastResponse);
      }
      return r;
    }).get().pipe(map(
      val => {

        if (val.docs.length > 0) {
          this.lastResponse = val.docs[val.docs.length - 1];
        }
        if (val.docs.length < 50) {

          this.more = false;
        } else {
          this.more = true;
        }
        return val.docs.map(r => r.data()) as User[];
      }
    ));
  }

  ConvertToCSV(objArray, headerList) {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (const index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in headerList) {
        // let head = headerList[index]; 
        line += ', ' + array[i][index];
      }
      line = line.slice(2);
      str += line + '\r\n';
    }
    return str;
  }


  emails() {
    this.db.collection('users').get().subscribe(
      val => {
        console.log('got data: ', val);

        const userList = val.docs.map(r => r.data()) as User[];
        const headlines = ['Email'];
        const l = userList.length;
        // 1. Get Poll
        // 2. get All Votes
        const data = [];
        for (const d of userList) {
          const e = [d.email];

          data.push(e);
        }



        const filename = 'emails';
        const csvData = this.ConvertToCSV(data, headlines);
        console.log(csvData);
        const blob = new Blob(['\ufeff' + csvData], {
          type: 'text/csv;charset=utf-8;'
        });
        const dwldLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const isSafariBrowser = navigator.userAgent.indexOf(
          'Safari') != -1 &&
          navigator.userAgent.indexOf('Chrome') == -1;

        // if Safari open in new window to save file with random filename. 
        if (isSafariBrowser) {
          dwldLink.setAttribute('target', '_blank');
        }
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', filename + '.csv');
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
        console.log('qu: ', data);
      }
    );



  }


  toggleUserAdmin(uid, adminRights) {
    this.adminService.toggleUserAdmin(uid, adminRights);
  }
  toggleUserSuper(uid, adminRights) {
    this.adminService.toggleUserSuper(uid, adminRights);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
