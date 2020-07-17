import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import { User } from '../../../shared/models/user.interface';
import { PollService } from '../../../shared/services/poll.service';
import { AdminService } from '../../../shared/services/admin.service';
import { Store } from 'store';

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
  userList = [];
  // subscription: Subscription;
  constructor(
              private store: Store, 
              private db: AngularFirestore, 
              private adminService: AdminService,
              private pollService:PollService) {}

  ngOnInit() {
    this.store.set('backButton', 'account');
    this.users$ = this.db.collection<User>('users').valueChanges();
    
    this.users$.subscribe(userList => {
      this.userList = userList;
    });
  }


ConvertToCSV(objArray, headerList) { 
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray; 
  let str = ''; 
  let row = ''; 
  for (let index in headerList) { 
      row += headerList[index] + ','; 
  } 
  row = row.slice(0, -1); 
  str += row + '\r\n'; 
  for (let i = 0; i < array.length; i++) { 
      let line = ""; 
      for (let index in headerList) { 
          //let head = headerList[index]; 
          line += ", " + array[i][index]; 
      } 
      line = line.slice(2);
      str += line + "\r\n"; 
  } 
  return str; 
} 


emails() {
    let headlines = ["Email"];
    let l = this.userList.length;
    // 1. Get Poll
    // 2. get All Votes
    let data = [];
    for (let d of this.userList) {
      var e = [d.email];
      
      data.push(e);
    }
          
  

    let filename = "emails";
    let csvData = this.ConvertToCSV(data, headlines); 
    console.log(csvData) 
    let blob = new Blob(['\ufeff' + csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser = navigator.userAgent.indexOf( 
      'Safari') != -1 &&
    navigator.userAgent.indexOf('Chrome') == -1; 
    
    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download", filename + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
    console.log("qu: ", data);

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
