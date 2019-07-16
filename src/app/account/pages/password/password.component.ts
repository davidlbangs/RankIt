import { Component, OnInit } from '@angular/core';
import { Store } from 'store';

@Component({
  selector: 'app-password',
  styleUrls: ['./password.component.scss'],
  template: `

    <main>
      
    </main>

  `,
})
export class PasswordComponent implements OnInit {

  constructor(
              private store:Store) { }

  ngOnInit() {

    this.store.set('backButton', 'account');
  }

}
