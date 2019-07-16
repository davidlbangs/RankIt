import { Component, OnInit, OnChanges, SimpleChanges, Output, Input, EventEmitter, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { PollService } from '../../../shared/services/poll.service';
import { Poll } from '../../../shared/models/poll.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'poll-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['poll-form.component.scss'],
  template: `
    <div class="poll-form">
      <form action="" [formGroup]='form'>

        <div class="poll-form__name">
          <mat-form-field appearance="outline">
            <mat-label>Question/Title of Poll</mat-label>
            <input matInput placeholder="" formControlName="title">
          </mat-form-field>
        </div>

        <div class="poll-form__choices mb-4">
          <div class="poll-form__subtitle">
            <h2>Choices</h2>
          </div>
          <div class="" formArrayName="choices">
            <mat-form-field appearance="outline" floatLabel="never" *ngFor="let c of choices.controls; index as i;">
              <div [formGroupName]="i">
                <input matInput placeholder="" formControlName="label">
                <input type="hidden" formControlName="initial_order" />
              </div>

              <button mat-button matSuffix mat-icon-button aria-label="Clear" (click)="value=''">
                <i class="fa fa-times"></i>
              </button>
              
            </mat-form-field>
          </div>


          <button mat-button color="accent" type="button" class="poll-form__add"
              (click)="addChoice()">+ Add Choice
            </button>
        </div>

        <div class="poll-form__options">
          
          <h2>Options</h2>

          <div class="option-row">
            <mat-checkbox formControlName="keep_open" [labelPosition]="'before'">Keep poll open until I close it</mat-checkbox>
            
          </div>
          <div class="option-row" *ngIf="showLength">
            <div class="option-row__label">
              <p>Custom Poll Length</p>
            </div>
            <div class="option-row__option" formGroupName="length">
                  <mat-form-field>
                    <mat-select formControlName="display_count">
                      <mat-option [value]="i" *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]">{{i}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field>
                    <mat-select formControlName="display_units">
                      <mat-option value="days">Days</mat-option>
                      <mat-option value="hours">Hours</mat-option>
                    </mat-select>
                  </mat-form-field>
            </div>
          </div>
          <div class="option-row">
            <mat-checkbox formControlName="randomize_order" name="randomize_order" [labelPosition]="'before'">Randomize Order</mat-checkbox>
            
          </div>
          <div class="option-row">
            <div class="option-row__label">
              Winners <span class="explain" (click)="openDialog('winners')">?</span>
            </div>
            <div class="option-row__option">
                  <mat-form-field>
                    <mat-select formControlName="winner_count">
                      <mat-option value="1">1</mat-option>
                      <mat-option value="2">2</mat-option>
                    </mat-select>
                  </mat-form-field>
            </div>
          </div>
          <div class="option-row">
            <div class="option-row__label">
              Label <span class="explain" (click)="openDialog('label')">?</span>
            </div>
            <div class="option-row__option">
                  <mat-form-field>
                    <input matInput formControlName="label" />
                  </mat-form-field>
            </div>
          </div>

          <div class="cta-section" formGroupName="cta">
            <div class="option-row">
                <mat-checkbox formControlName="custom" [labelPosition]="'before'">Custom Call to Action</mat-checkbox>
             </div>
             <div class="cta-section__setup" *ngIf="showCustomCTA">
                 <div class="header mt-1 mb-1">
                   <h3 class="mb-1">Custom Call to Action</h3>
                   <p>Once a user has finished voting, they’ll be shown a screen that describes Ranked Choice voting. You may show a custom button to direct users back to your website.</p>
                 </div>
                 <div class="option-row">
                    <div class="option-row__label">
                      <strong>CTA Button Label</strong>
                    </div>
                    <div class="option-row__option">
                          <mat-form-field appearance="outline">
                            <input matInput formControlName="label" />
                          </mat-form-field>
                    </div>
                  </div> 
                <div class="option-row mt-0 pt-0">
                  <div class="option-row__label">
                    <strong>CTA Link</strong>
                  </div>
                  <div class="option-row__option">
                        <mat-form-field appearance="outline">
                          <input matInput formControlName="url" />
                        </mat-form-field>
                  </div>
                </div> 
            </div>
          </div>
        </div>

        <hr class="mt-3 mb-3" />

        <div class="poll-form__submit mb-5">
          <div>
            <button 
              type="button"
              *ngIf="!exists"
              (click)="createPoll()"
              mat-raised-button [color]="'primary'" 
              class=" has-icon dark-icon mb-3 mr-1">
              Create Poll
            </button>

            <button 
              type="button"
              *ngIf="exists"
              mat-raised-button [color]="'primary'"
              (click)="updatePoll()">
              Save Poll
            </button>
            <!-- ../ takes back to previously came from -->
            <a mat-button [routerLink]="['../']" class="button button--cancel">Cancel</a>
          </div>

          <div class="poll-form__delete" *ngIf="exists">
            <div *ngIf="toggled">
              <p>Delete Poll?</p>
              <button class="confirm" type="button" (click)="removePoll()">Yes</button>
              <button class="cancel" type="button" (click)="toggle()">No</button>
            </div>

            <button class="button button--delete" type="button" (click)="toggle()">
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>

    <!--{{ form.value | json }}
    <hr />
    {{ poll | json }}-->
  `
})
export class PollFormComponent implements OnInit, OnChanges {
  toggled = false;
  exists = false;

  @Input()
    poll:Poll;

  @Output() 
    create = new EventEmitter<Poll>();
  @Output() 
    update = new EventEmitter<Poll>();
  @Output() 
    remove = new EventEmitter<Poll>();

  form = this.fb.group({
    title: [''],
    keep_open: [''],
    choices: this.fb.array(['']),
    length: this.fb.group({
      end_time: [''],
      display_count: [''],
      display_units: ['']
    }),
    winner_count: [''],
    randomize_order: [''],
    label: [''],
    cta: this.fb.group({
      custom: [''],
      label: [''],
      url: ['']
    }),

  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
    ) {}


  get showLength() {
    return !this.form.get('keep_open').value;
  }

  get showCustomCTA() {
    return this.form.get('cta').get('custom').value;
  }


  get choices() {
    return this.form.get('choices') as FormArray;
  }

  get choiceControl() {
    return this.fb.group({
      label: [''],
      initial_order: ['']
    });
  }

  get required() {
    return (
      this.form.get('title').hasError('required') &&
      this.form.get('title').touched
      );
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
     // this is the stream checker for when the poll is populated.
     // once there's a poll name, we got a poll!
     // Except not, since we don't automatically send a Poll title...?
     if(this.poll && this.poll.title) {
       this.exists = true;
     }
       
       // remove choices that are on the form at the moment.
       // Angular won't remove / add items on a FormArray, we have to empty/refill ourselves.
       this.emptyChoices(); 

       const value = this.poll;
       console.log(value);
       this.form.patchValue(value); // patch value updates portion of form.
       

       if(value.choices) {
         for(const item of value.choices) {
           this.choices.push(this.fb.group({
             'label': [item.label],
             'initial_order': [item.initial_order]
           }));
         }
       }
  }

  emptyChoices() {
    // this is a quirk of angular.
    while (this.choices.controls.length) {
      this.choices.removeAt(0); // keep iterating and keep removing from index of 0 till loop is finished.
    }
  }

  createPoll() {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    }
  }

  updatePoll() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }
  removePoll() {
     this.remove.emit(this.form.value);
  }

  addChoice() {
    this.choices.push(this.choiceControl);
  }

  removeChoice(index: number) {
    this.choices.removeAt(index);
  }

  toggle() {
    this.toggled = !this.toggled;
  }


  openDialog(picker:string){
    let title = '';
    let body = '';

    if(picker == 'winners') {
      title = 'Multi-Winner Polls';
      body = 'Some elections (committees, for example) have multiple winners. To see how we calculate multi-winner polls, please check out our example on FairVote.org.';
    }
    if(picker == 'label') {
      title = 'Custom Labels';
      body = '<p style="margin-bottom:1rem;">When showing how results are calculated, it helps to change the word “choice” to something specific to your poll. The label should always be singular.</p><p><strong>Example:</strong> In a poll on NBA players, we would use <strong>player</strong> as the label since “player” describes Michael Jordan, LeBron James, and Tim Duncan.</p>';
    }

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '300px',
      data: {title, body}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


@Component({
  selector: 'dialog-overview',
  styles: [`
  div.body { font-size: 15px; color: #69757C; line-height: 1.3;}
  `],
  template: `

  <h1 mat-dialog-title>{{data.title}}</h1>
  <div mat-dialog-content class="body">
    <div [innerHTML]="data.body"></div>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Close</button>
  </div>
  `
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}