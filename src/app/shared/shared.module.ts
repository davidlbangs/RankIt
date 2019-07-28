import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import {
  MatButtonModule, 
  MatCheckboxModule, 
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatDialogModule } from '@angular/material';
import { HeaderComponent } from './components/header/header.component';
import { ShufflePipe } from './pipes/shuffle.pipe';

@NgModule({
  declarations: [HeaderComponent, ShufflePipe],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule
  ],
  exports: [
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatRadioModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule
    ]
})
export class SharedModule { }
