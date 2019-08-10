import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import {AngularFireAuthModule} from '@angular/fire/auth';

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
  MatSnackBarModule,
  MatDialogModule } from '@angular/material';
import { HeaderComponent } from './components/header/header.component';
import { ShufflePipe } from './pipes/shuffle.pipe';
import { SharePollComponent } from './components/share-poll/share-poll.component';

@NgModule({
  declarations: [HeaderComponent, ShufflePipe, SharePollComponent],
  imports: [
    CommonModule,
    RouterModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
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
    MatSnackBarModule,
    MatRadioModule,
    HeaderComponent,
    SharePollComponent,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule
    ]
})
export class SharedModule { }
