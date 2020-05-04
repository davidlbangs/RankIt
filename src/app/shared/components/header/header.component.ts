import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'store';
import { User } from '../../models/user.interface';
import { Poll } from '../../models/poll.interface';

@Component({
  selector: 'app-header',
  template: `
    
    <header>
      <div class="nav">
        <div *ngIf="backButton$ | async as backButton">
         <a mat-mini-fab color="accent" [ngStyle]="{'backgroundColor': buttonColor != '' ? buttonColor : '#ff4081;'}" [routerLink]="backButton" class="backButton"><i class="fa fa-chevron-left"></i></a>  
        </div>
      </div>
      <ng-container *ngIf="poll$ | async as poll else default">

      
<div class="logo" style="max-width:200px;">
      <img style="max-width:200px;" *ngIf="customLogo" [src]="logoUrl" />
      <img style="max-width:150px;" *ngIf="!customLogo" src="/assets/images/rankit-color.svg" alt="RankIt" [routerLink]="['/']" />

    </div>
    
        </ng-container>
        <ng-template #default>
      <div class="logo">
        <img src="/assets/images/rankit-color.svg" alt="RankIt" [routerLink]="['/']" />
      </div>
      
      </ng-template>

      <div class="action">
      <div class="longMenu">
        <ul>
          <li><a [routerLink]="['/home']">Home</a></li>
          <li><a [routerLink]="['/polls']" *ngIf="user">My Polls</a></li>
          <li><a [routerLink]="['/account']" *ngIf="user">My Account</a></li>
          <li><a [routerLink]="['/auth/login']" *ngIf="!user">Login</a></li>
          <li><a class="highlight" [routerLink]="['/polls/create']" *ngIf="user">Create Poll</a></li>

        </ul>
      </div>
      <button class="burgerMenu" mat-icon-button [matMenuTriggerFor]="menu" aria-label="Menu">
      <i class="fa fa-bars"></i>
</button>
<mat-menu #menu="matMenu">
  <button mat-menu-item [routerLink]="['/home']">
    <span>Home</span>
  </button>
  <button mat-menu-item *ngIf="user" [routerLink]="['/polls']">
    <span>My Polls</span>
  </button>
  <button mat-menu-item *ngIf="user" [routerLink]="['/account']">
    <span>My Account</span>
  </button>
  <button mat-menu-item *ngIf="!user" [routerLink]="['/auth/login']">
    <span>Login</span>
  </button>
  <button mat-menu-item *ngIf="user" [routerLink]="['/polls/create']">
    <span>Create Poll</span>
  </button>
  
</mat-menu>
<!--
        <div *ngIf="user">
          <a mat-mini-fab color="" [routerLink]="['/account']" class="user"><i class="fa fa-user"></i></a>
        </div>
        <div *ngIf="!user">
          <a mat-button color="" [routerLink]="['/auth/login']" class="button">Login</a>
        </div>-->
      </div>
    </header>

  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // @Input() backButton:string;
  @Input() user:User;
  poll$:Observable<Poll>;
  backButton$:Observable<string>;
  customLogo = false;
  buttonColor = "";
  logoUrl = "";
  constructor(
              private store:Store) { }

  ngOnInit() {
    this.poll$ = this.store.select('poll');
    this.backButton$ = this.store.select('backButton');

    this.poll$.subscribe(poll => {
      if (poll && poll.customizations && poll.customizations.logoUrl != "") {
        this.customLogo = true;
        this.logoUrl = poll.customizations.logoUrl;
        this.buttonColor = poll.customizations.buttonColor1;
      }
    });
  }

}
