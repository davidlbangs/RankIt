import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Description } from '../../../shared/models/poll.interface';

@Component({
  selector: 'home-description',
  styleUrls: ['./description.component.scss'],
  template: `
  
    <h1 class="mb-2 mt-4">{{ content.headline }}</h1>
    <div class="mb-2 responsive-wrapper">
      <iframe width="700" height="394" class="embed-responsive-item" [src]="internal_url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    <div [innerHTML]="internal_html"></div>

    <p class="pb-4"><a href="https://www.fairvote.org" class="btn btn-primary" mat-button mat-raised-button [color]="'accent'" >Learn More at Fairvote.org</a></p>

  `
})
export class DescriptionComponent implements OnInit {

  internal_url: any;
  internal_html:any;

  @Input() content:Description;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.internal_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.video_url);
    this.internal_html = this.sanitizer.bypassSecurityTrustHtml(this.content.text);
  }

}
