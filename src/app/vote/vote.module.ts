import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VoteComponent } from './pages/vote/vote.component';
import {HttpClientModule} from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChoiceComponent } from './component/choice/choice.component';

import {  DragDropModule } from '@angular/cdk/drag-drop';
import { SuccessComponent } from './pages/success/success.component';

export const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'not-found' },
  { path: 'not-found', pathMatch: 'full', component: NotFoundComponent },
  { path: ':id', component: VoteComponent },
  { path: ':id/success', component: SuccessComponent },
];

@NgModule({
  declarations: [VoteComponent, NotFoundComponent, ChoiceComponent, SuccessComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    DragDropModule
  ]
})
export class VoteModule { }
