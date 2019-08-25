import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  styleUrls: ['./not-found.component.scss'],
  template: `

    <header class="poll-header">
          <h1 class="">No Poll Found.</h1>  
    </header>

    <main>
      <a 
          mat-button mat-raised-button [color]="'secondary'" 
          class="d-block has-icon dark-icon button-large p-1 mb-2 mt-4" 
          href="/">Go Home</a>

    </main>

  `
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
