import { Component, OnInit } from '@angular/core';
import { Store } from 'store';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-privacy',
  template: `
     <header class="poll-header">
          <h1 class="">Privacy Policy</h1>  
      </header>
      <main>
        <p class="pt-4 pb-4" style="padding-top:2rem;">Please read our privacy policy <a href="https://app.termly.io/document/privacy-policy/2bab93f5-e82a-4c6b-95a9-7d3e0b67754b">here</a>.</p>
      </main>
  `,
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor(
              private meta:MetaService,
              private store: Store) {
    // this.polls = db.collection('items').valueChanges();
  }

  ngOnInit() {
    this.store.set('backButton', '/');
    this.meta.setTitle('Privacy Policy');
  }

}
