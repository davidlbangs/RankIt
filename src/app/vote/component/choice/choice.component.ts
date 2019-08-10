import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

import { Choice } from '../../../shared/models/poll.interface';

@Component({
  selector: 'poll-choice',
  styleUrls: ['./choice.component.scss'],
  template: `

    <div *ngIf="active; else inactive" class="choice-wrapper">
      <div class="choice is-active">
        <div class="index">
          #{{index}}
        </div>

        {{choice}}
      </div>
      <div class="controls">
        <div class="control">
          <button 
            *ngIf="index > 1"
            (click)="onMoveUp(choice)" mat-button><i class="fa fa-chevron-up"></i></button>
        </div>
        <div class="control" *ngIf="index === votes.length">
          <button (click)="onToggleVote(choice)" mat-button><span class="custom-remove">–</span></button>
        </div>
        <div class="control" *ngIf="index < votes.length">
          <button 
          (click)="onMoveDown(choice)" mat-button><i class="fa fa-chevron-down"></i></button>
        </div>
      </div>
    </div>

    <ng-template #inactive>
      <div class="choice {{active ? 'is-active' : '' }}">
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

  onMoveUp(choice:string) { this.moveUp.emit(choice); }
  onMoveDown(choice:string) { this.moveDown.emit(choice); }
  onToggleVote(choice:string) { this.toggle.emit(choice); }

}
