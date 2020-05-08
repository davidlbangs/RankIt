import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {Poll } from '../../models/poll.interface';
import { AppSettings } from '../../../app.settings';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'success-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="success-panel" *ngIf="poll">
      <div class="wrap" style="margin-bottom:100px;">
        <h1 class="mt-2 mb-2" *ngIf="fromVote">Thank you for your vote!</h1>

        <hr class="mb-2" *ngIf="fromVote" />

        <h1 class="mb-2">{{heading}}</h1>

        <p class="mb-2">{{body}}</p>

      
        <a 
          mat-button mat-raised-button [color]="'secondary'" [ngStyle]="{'backgroundColor': poll.customizations?.buttonColor2 != '' ? poll.customizations?.buttonColor2 : '#ff4081;'}" 
          class="d-block has-icon dark-icon button-large p-1 mb-2" 
          href="{{ctaUrl(poll)}}" *ngIf="poll.cta.custom=='link'">{{ctaLabel(poll)}}</a>

          <div *ngIf="poll.cta.custom=='html'" [innerHtml]="html(poll)"></div>


         <hr class="mb-2" />

        <share-poll [poll]="poll"></share-poll>
        </div>
    </div>
  `,
  styleUrls: ['./success-card.component.scss']
})
export class SuccessCardComponent {
  @Input() poll:Poll;
  @Input() fromVote:boolean = false;
  defaultText = AppSettings.defaultText;

  constructor(private _dom: DomSanitizer) { }



  get heading() {
    return this.defaultText.successTitle;
  }

  get body() {
    return this.defaultText.successBody;
  }

  html(poll:Poll) {
    return this._dom.bypassSecurityTrustHtml(this.poll.cta.html);
  }

  ctaLabel(poll:Poll) {
    if(poll.cta.custom) {
      return poll.cta.label;
    } else {
      return this.defaultText.successButtonLabel;
    }  
  }

  ctaUrl(poll:Poll) {
    if(poll.cta.custom) {
      return poll.cta.url;
    } else {
      return this.defaultText.successButtonUrl;
    }  
  }

}
