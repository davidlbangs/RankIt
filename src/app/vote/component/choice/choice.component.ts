import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

import { Choice } from '../../../shared/models/poll.interface';

@Component({
  selector: 'poll-choice',
  styleUrls: ['./choice.component.scss'],
  template: `

    <div *ngIf="active; else inactive">
      <div class="choice is-active" (click)="toggleVote()">
        <div class="index">
          #{{index}}
        </div>

        {{choice}}
      </div>
    </div>

    <ng-template #inactive>
      <div class="choice {{active ? 'is-active' : '' }}" (click)="toggleVote()">
        {{choice}}
      </div>
    </ng-template>

  `,
})
export class ChoiceComponent implements OnInit {

  @Input() choice: Choice;
  @Input() votes?: Choice[];
  @Input() active?: boolean;
  @Output() toggle = new EventEmitter<Choice>();
  @Output() moveUp = new EventEmitter<Choice>();
  @Output() moveDown = new EventEmitter<Choice>();

  constructor() { }

  ngOnInit() {
  }

  get index() {
    return this.votes.indexOf(this.choice) + 1;
  }

  toggleVote() {
    console.log('toggle');
  }

}
