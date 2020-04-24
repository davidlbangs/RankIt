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
         <a mat-mini-fab color="accent" [routerLink]="backButton" class="backButton"><i class="fa fa-chevron-left"></i></a>  
        </div>
      </div>
      <ng-container *ngIf="poll$ | async as poll else default">

      <div class="logo">
      <img style="max-width:150px;"src="/assets/images/rankit-color.svg" alt="RankIt" [routerLink]="['/']" />
</div>
<div class="logo">
      <img style="max-width:200px;" *ngIf="customLogo" [src]="logoUrl" />
    </div>
        </ng-container>
        <ng-template #default>
      <div class="logo">
        <img src="/assets/images/rankit-color.svg" alt="RankIt" [routerLink]="['/']" />
      </div>
      <div class="action">
        <div *ngIf="user">
          <a mat-mini-fab color="" [routerLink]="['/account']" class="user"><i class="fa fa-user"></i></a>
        </div>
        <div *ngIf="!user">
          <a mat-button color="" [routerLink]="['/auth/login']" class="button">Login</a>
        </div>
      </div>
      </ng-template>
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
  logoUrl = "";
  constructor(
              private store:Store) { }

  ngOnInit() {
    this.poll$ = this.store.select('poll');
    this.backButton$ = this.store.select('backButton');

    this.poll$.subscribe(poll => {
      if (poll && poll.customizations.logoUrl != "") {
        this.customLogo = true;
        this.logoUrl = poll.customizations.logoUrl;
      }
    });
  }

}
