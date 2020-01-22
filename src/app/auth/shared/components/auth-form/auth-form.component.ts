import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'auth-form',
  styleUrls: ['auth-form.component.scss'],
  template: `
    <div class="auth-form">

    <form action="" [formGroup]="form" (ngSubmit)="onSubmit()">
      
        <ng-content select="h1"></ng-content>


        <label for="">
            <input 
              type="email" 
              placeholder="Email Address"
              formControlName="email" />
        </label>
        <label for="">
            <input 
              type="Password" 
              placeholder="Enter Password"
              formControlName="password" />
        </label>
        <div class="error" *ngIf="emailFormat">
          Invalid Email format  
        </div>
        <div class="error" *ngIf="passwordInvalid">
          Password is Required 
        </div>

        <ng-content select=".error"></ng-content>

        <div class="auth-form__action">
          <ng-content select="button"></ng-content>
        </div>
        <div class="auth-form__toggle">
          <ng-content select="a"></ng-content>
        </div>
    </form>

    </div>
  `
})
export class AuthFormComponent implements OnInit {
  
  @Output()
    submitted = new EventEmitter<FormGroup>();

  form = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });

  constructor(
    private fb:FormBuilder) {}
    

  onSubmit() {
    if(this.form.valid){
      this.submitted.emit(this.form);
    }
  }

  get passwordInvalid() {
    const control = this.form.get('password');
    return control.hasError('required') && control.touched;
  }

  get emailFormat() {
    const control = this.form.get('email');
    return control.hasError('email') && control.touched;
  }

  ngOnInit() {
    
  }
}