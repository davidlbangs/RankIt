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
        <div class="control control-move-up">
          <button 
            (click)="onMoveUp(choice, index)"><i class="fa fa-chevron-up"></i></button>
        </div>
        <div class="control control-delete">
          <button (click)="onToggleVote(choice, index)"><span class="custom-remove">–</span></button>
        </div>
        <div class="control control-move-down">
          <button 
          (click)="onMoveDown(choice, index)"><i class="fa fa-chevron-down"></i></button>
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

  onMoveUp(choice:string, index: number) { (index > 1) ? this.moveUp.emit(choice) : null; }
  onMoveDown(choice:string, index: number) { (index != this.votes.length) ? this.moveDown.emit(choice) : null; }
  onToggleVote(choice:string, index: number) {  this.toggle.emit(choice); }

}
