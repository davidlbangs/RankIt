import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Store } from 'store';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `


  <div class="wrapper">
  <app-header></app-header>
  <router-outlet></router-outlet>
  </div>

  <div id="sillyOverlay" style="z-index: 999999;bottom: 10px; left: 30px;position:fixed;" *ngIf="SILLY_OVERLAY" >
    <button type="button" (click)="checkState()">Check State</button> 
</div>

  `
})
export class AppComponent {
  SILLY_OVERLAY = (environment.production == false) ? true : false;
  title = 'rankit';
  items: Observable<any[]>;
  constructor(private db: AngularFirestore, private store: Store) {
    this.items = db.collection('items').valueChanges();
  }

  checkState() {
    console.log(this.store.value);
  }
}
