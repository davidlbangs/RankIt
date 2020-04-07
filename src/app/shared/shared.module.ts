import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import {AngularFireAuthModule} from '@angular/fire/auth';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from './components/header/header.component';
import { ShufflePipe } from './pipes/shuffle.pipe';
import { SharePollComponent } from './components/share-poll/share-poll.component';
import { EmbedPollComponent } from './components/embed-poll/embed-poll.component';
import { SuccessCardComponent } from './components/success-card/success-card.component';

@NgModule({
  declarations: [HeaderComponent, ShufflePipe, SharePollComponent, EmbedPollComponent, SuccessCardComponent],
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
    EmbedPollComponent,
    SuccessCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule
    ]
})
export class SharedModule { }
