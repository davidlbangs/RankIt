import { Component, OnInit } from '@angular/core';
import { Store } from 'store';

@Component({
  selector: 'app-privacy',
  template: `
     <header class="poll-header">
          <h1 class="">Privacy Policy</h1>  
      </header>
      <main>
        TODO
      </main>
  `,
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor(
              private store: Store) {
    // this.polls = db.collection('items').valueChanges();
  }

  ngOnInit() {
    this.store.set('backButton', '/');
  }

}
