import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'store';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-header',
  template: `
    
    <header>
      <div class="nav">
        <div *ngIf="backButton$ | async as backButton">
         <a mat-mini-fab color="accent" [routerLink]="backButton" class="backButton"><i class="fa fa-chevron-left"></i></a>  
        </div>
      </div>
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
    </header>

  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // @Input() backButton:string;
  @Input() user:User;
  backButton$:Observable<string>;
  constructor(
              private store:Store) { }

  ngOnInit() {
    this.backButton$ = this.store.select('backButton');
  }

}
