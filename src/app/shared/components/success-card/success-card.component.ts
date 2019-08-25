import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {Poll } from '../../models/poll.interface';
import { AppSettings } from '../../../app.settings';

@Component({
  selector: 'success-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="success-panel" *ngIf="poll">
      <main class="clear-footer">
        <h2 class="mt-2 mb-2" *ngIf="fromVote">Thank you for your vote!</h2>

        <hr class="mb-2" *ngIf="fromVote" />

        <h1 class="mb-2">{{heading}}</h1>

        <p class="mb-2">{{body}}</p>


        <a 
          mat-button mat-raised-button [color]="'secondary'" 
          class="d-block has-icon dark-icon button-large p-1 mb-2" 
          href="{{ctaUrl(poll)}}">{{ctaLabel(poll)}}</a>

         <hr class="mb-2" />

        <share-poll [poll]="poll"></share-poll>
      </main> 
    </div>
  `,
  styleUrls: ['./success-card.component.scss']
})
export class SuccessCardComponent {
  @Input() poll:Poll;
  @Input() fromVote:boolean = false;
  defaultText = AppSettings.defaultText;

  constructor() { }

  get heading() {
    return this.defaultText.successTitle;
  }

  get body() {
    return this.defaultText.successBody;
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
