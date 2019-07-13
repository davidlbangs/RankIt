import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule, 
  MatCheckboxModule, 
  MatListModule,
  MatCardModule, 
  MatRadioModule } from '@angular/material';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatRadioModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatRadioModule,
    HeaderComponent
    ]
})
export class SharedModule { }
