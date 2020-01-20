import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'public-not-found',
  styleUrls: ['./not-found.component.scss'],
  template: `

    <header class="poll-header">
          <h1 class="">Oops! We lost your page.</h1>  
    </header>

    <main>
      <p class="mt-2">It looks like the page you were looking for is lost. How about going home?</p>
      <a 

          mat-button mat-raised-button [color]="'accent'" 
          class="d-block has-icon dark-icon button-large p-1 mb-2 mt-4" 
          href="/">Go Home</a>

    </main>

  `
})
export class PublicNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
