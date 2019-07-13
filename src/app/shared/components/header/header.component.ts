import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    
    <header>
      <div class="nav">
       
      </div>
      <div class="logo">
        <img src="/assets/images/rankit-color.svg" alt="" />
      </div>
      <div class="action">
        
      </div>
    </header>

  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
