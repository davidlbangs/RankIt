import { Component, OnInit, OnChanges, SimpleChanges, Output, Input, EventEmitter, ChangeDetectionStrategy, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { PollService } from '../../../shared/services/poll.service';
import { Poll } from '../../../shared/models/poll.interface';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../shared/models/user.interface';

@Component({
  selector: 'poll-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['poll-form.component.scss'],
  template: `
    <div class="poll-form">
      <form action="" [formGroup]='form'>

        <h2>Question/Title of Poll</h2>

        <div class="poll-form__name">
          <mat-form-field appearance="outline" floatLabel="never">
            <input matInput placeholder="" formControlName="title" required>
          </mat-form-field>
          <div *ngIf="title.invalid && (title.dirty || title.touched)" class="alert alert-danger">
            <div *ngIf="title.errors.required">
              A poll question is required.
            </div>
          </div>
        </div>

        <div class="poll-form__choices mb-4">
          <div class="poll-form__subtitle">
            <h2>Choices</h2>
          </div>
          <div class="" formArrayName="choices">



            <section *ngFor="let c of choices.controls; index as i;">
            <mat-form-field appearance="outline" floatLabel="never">
                <input matInput placeholder="" [formControlName]="i" (keydown)="onKeydown($event, i)">

                <button 
                  *ngIf="choices.controls.length > 2"
                  mat-button matSuffix mat-icon-button aria-label="Remove"
                  tabindex="-1" 
                  (click)="removeChoice(i)">
                  <i class="fa fa-times"></i>
                </button>
              
            </mat-form-field>
            <div *ngIf="c.invalid && (c.dirty || c.touched)" class="alert alert-danger">
              <div *ngIf="c.errors.required">
                Choices cannot be left blank.
              </div>
            </div>
            </section>
            <div *ngIf="choices.invalid && (choices.dirty || choices.touched)" class="alert alert-danger">
              <div *ngIf="choices.errors && choices.errors.validateUniqueChoices">
                Choices must be unique.
              </div>
            </div>
          </div>
          


          <button mat-button color="accent" type="button" class="poll-form__add"
              (click)="addChoice()">+ Add Choice
            </button>
        </div>

        <div class="poll-form__options">
        <div *ngIf="user.roles.admin" formGroupName="customizations">
          <h2>Customizations</h2>

          <div class="option-row">
          <div class="option-row__label">
          <p>Logo URL</p>
        </div>
          <mat-form-field appearance="outline" floatLabel="never">
            <input matInput placeholder="" formControlName="logoUrl">
          </mat-form-field>
          </div>

          <div class="option-row">
          <div class="option-row__label">
          <p>Bar Color (Hexcode)</p>
        </div>
          <mat-form-field appearance="outline" floatLabel="never">
            <input matInput placeholder="" formControlName="barColor">
          </mat-form-field>
          </div>

          <div class="option-row">
          <div class="option-row__label">
          <p>Font Color (Hexcode)</p>
        </div>
          <mat-form-field appearance="outline" floatLabel="never">
            <input matInput placeholder="" formControlName="color">
          </mat-form-field>
          </div>
        </div>
          
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
            <mat-checkbox formControlName="limit_votes" name="limit_votes" [labelPosition]="'before'">Limit Repeat Voting</mat-checkbox>
            
          </div>
          <div class="option-row">
            <div class="option-row__label">
              Winners <span class="explain" (click)="openDialog('winners')">?</span>
            </div>
            <div class="option-row__option">
                  <mat-form-field>
                    <mat-select formControlName="winner_count">
                      <mat-option *ngFor="let choice of totalWinners; let i = index;" [value]="i+1">
                        {{i+1}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
            </div>
            
          </div>
          <div *ngIf="winner_count.invalid && (winner_count.dirty || winner_count.touched)" class="alert alert-danger">
            <div *ngIf="winner_count.errors.required">
              Please choose the number of winners for this poll.
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
          <div *ngIf="label.invalid && (label.dirty || label.touched)" class="alert alert-danger">
              <div *ngIf="label.errors.required">
                A label is required.
              </div>
          </div>

          <div class="cta-section option-row" formGroupName="cta">
          <div class="option-row__label">
           Custom Call to Action
          </div>
          <div class="option-row__option">
                <!--mat-checkbox formControlName="custom" [labelPosition]="'before'">Custom Call to Action</mat-checkbox-->
                <mat-form-field>
                <mat-select formControlName="custom">
                  <mat-option [value]="'link'">
                    Link
                  </mat-option>
                  <mat-option [value]="'html'">
                    HTML
                  </mat-option>
                </mat-select>
              </mat-form-field>
                </div>
             
            </div>
          </div>
          <div class="cta-section__setup" *ngIf="showCustomCTA" formGroupName="cta">
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

          <div class="cta-section__setup" *ngIf="showCustomHTML" formGroupName="cta">
            <div class="header mt-1 mb-1">
              <h3 class="mb-1">Custom HTML</h3>
              <p>Once a user has finished voting, they’ll be shown a screen that describes Ranked Choice voting. You may show a custom HTML snippet to direct users back to your website.</p>
            </div>
            <div class="option-row">
              <div class="option-row__label">
                <strong>HTML</strong>
              </div>
              <div class="option-row__option">
                    <mat-form-field appearance="outline">
                      <textarea matInput formControlName="html"></textarea>
                    </mat-form-field>
              </div>
            </div> 
          </div>

        <hr class="mt-3 mb-3" />

        <div class="poll-form__submit mb-5">
          <div>
            <button 
              type="button"
              *ngIf="!exists"
              [disabled]="(form.invalid && (form.dirty || form.touched))"
              (click)="createPoll(false)"
              mat-raised-button [color]="'primary'" 
              class=" has-icon dark-icon mb-3 mr-1">
              Save Poll
            </button>

            <button 
              type="button"
              *ngIf="!exists"
              [disabled]="(form.invalid && (form.dirty || form.touched))"
              (click)="createPoll(true)"
              mat-raised-button [color]="'primary'" 
              class=" has-icon dark-icon mb-3 mr-1">
              Save Poll & Publish
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

          <div *ngIf="form.invalid && (form.dirty || form.touched)" class="alert">
              <div>
                There are errors that need to be fixed above before this poll can be created.
              </div>
              <div *ngIf="choices.invalid">The choices are entered incorrectly. Each choice must be unique and no choices can be left blank.</div>
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

  `
})
export class PollFormComponent implements OnChanges {
  toggled = false;
  exists = false;

  @Input()
    poll:Poll;
  @Input()
    user:User;

  @Output() 
    create = new EventEmitter<Poll>();
  @Output() 
    createPublish = new EventEmitter<Poll>();
  @Output() 
    update = new EventEmitter<Poll>();
  @Output() 
    remove = new EventEmitter<Poll>();

  form = this.fb.group({
    title: ['', Validators.required],
    keep_open: [''],
    limit_votes: [''],
    choices: this.fb.array([''], this.validateUniqueChoices),
    length: this.fb.group({
      end_time: [''],
      display_count: [''],
      display_units: ['']
    }),
    winner_count: ['', Validators.required],
    randomize_order: [''],
    customizations: this.fb.group({
      logoUrl: [''],
      barColor: [''],
      color: ['']
    }),
    label: ['', [Validators.required, RxwebValidators.unique()]],
    cta: this.fb.group({
      custom: [''],
      label: [''],
      url: [''],
      html: ['']
    }),

  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public http: HttpClient
    ) {}

  validateUniqueChoices(choices: FormArray) {
    let a:string[] = choices.value;

    let noDuplicates = true;
    let counts = [];

    if(!a.includes("")) {
      for(var i = 0; i <= a.length; i++) {
        if(counts[a[i]] === undefined) {
          counts[a[i]] = 1;
        } else {
          noDuplicates = false;
        }
      }
    }

    // console.log('No Duplicates: ', noDuplicates, a, counts);

    return noDuplicates ? null : {
      validateUniqueChoices: {
        valid: false
      }
    };
  }
  

  get title() { return this.form.get('title'); }
  get winner_count() { return this.form.get('winner_count'); }
  get label() { return this.form.get('label'); }

  get showLength() {
    return !this.form.get('keep_open').value;
  }

  get showCustomCTA() {
    console.log('va: ', this.form.get('cta').get('custom').value);
    return this.form.get('cta').get('custom').value == "link";
  }

  get showCustomHTML() {
    return this.form.get('cta').get('custom').value == "html";
  }


  get choices() {
    return this.form.get('choices') as FormArray;
  }

  // We only allow winners for choices - 1.
  get totalWinners() {
    const totalWinners = this.choices.controls.length - 1;
    return new Array(totalWinners);
  }

  choicesArray(){
    let choices = this.form.get('choices');
    console.log('hey!', choices);
  }



  get required() {
    return (
      this.form.get('title').hasError('required') &&
      this.form.get('title').touched
      );
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
       this.form.patchValue(value); // patch value updates portion of form.
       

       if(value.choices) {
         for(const item of value.choices) {
           this.choices.push(new FormControl(item, [Validators.required]));
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
    this.choices.push(new FormControl('', Validators.required));
  }

  removeChoice(index: number) {
    this.choices.removeAt(index);

    let winner_count = this.form.get('winner_count').value;

    // If there are as many winners as choices, remove the winner count 
    // this prevents allowing too many winners.
    if(winner_count >= this.choices.length) {
      this.form.get('winner_count').patchValue(null);
    }
  }

  toggle() {
    this.toggled = !this.toggled;
  }


  openDialog(picker:string){
    let title = '';
    let body = '';

    if(picker == 'winners') {
      title = 'Multi-Winner Polls';
      body = 'Some elections (committees, for example) have multiple winners. To see how we calculate multi-winner polls, please check out our <a href="https://www.fairvote.org/multi_winner_rcv_example" target=_blank>example</a>.<br /><br />The maximum possible number of winners is the number of choices you add minus one.';
    }
    if(picker == 'label') {
      title = 'Custom Labels';
      body = 'When showing how results are calculated, it helps to change the word “choice” to something specific to your poll. The label should always be singular.<br /><br /><strong>Example:</strong> In a poll on NBA players, we would use <strong>player</strong> as the label since “player” describes Michael Jordan, LeBron James, and Tim Duncan.<br /><br /><strong>Irregular Plural:</strong> If your label has an irregular plural (child/children, woman/women) please stick to "choice".';
    }

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '300px',
      data: {title, body}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onKeydown(event, counter) {
    if (event.key === "Tab") {
      counter = counter + 1;
      let totalChoices = this.choices.controls.length;

      if(counter == totalChoices) {
          this.addChoice();
      }
    }
  }
}


@Component({
  selector: 'dialog-overview',
  styles: [`
  div.body { font-size: 15px; color: #69757C; line-height: 1.3;}
  p { margin-bottom: 1rem;}
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