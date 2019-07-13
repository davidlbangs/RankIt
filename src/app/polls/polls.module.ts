import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './pages/edit/edit.component';
import { ViewComponent } from './pages/view/view.component';

// shared
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './pages/detail/detail.component';

export const routes:Routes = [
  { path: '', component: ViewComponent },
  { path: 'new', component: EditComponent },
  { path: ':id', component: DetailComponent },
  { path: ':id/edit', component: EditComponent }
];


@NgModule({
  declarations: [EditComponent, ViewComponent, DetailComponent],
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PollsModule { }
