import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './pages/edit/edit.component';
import { ViewComponent } from './pages/view/view.component';

// shared
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './pages/detail/detail.component';
import { PollFormComponent, DialogOverviewExampleDialog } from './components/poll-form/poll-form.component';

// guards
import { AuthGuard } from '../auth/shared/guards/auth.guard';
import { MetaGuard } from 'meta';

import {  RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

export const routes:Routes = [
  { path: '', canActivate: [AuthGuard, MetaGuard],
    component: ViewComponent, 
    data: {
          meta: {
            title: 'My Polls'
          }
    },
   },
  { path: 'create', canActivate: [AuthGuard, MetaGuard], component: EditComponent,
  data: {
          meta: {
            title: 'Create Poll'
          }
    },
  },
  { path: ':id', canActivate: [AuthGuard], component: DetailComponent },
  { path: ':id/edit', canActivate: [AuthGuard], component: EditComponent }
];


@NgModule({
  declarations: [EditComponent, ViewComponent, DetailComponent, PollFormComponent, DialogOverviewExampleDialog],
  entryComponents: [DialogOverviewExampleDialog],
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PollsModule { }
