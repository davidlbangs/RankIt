import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './pages/home/home.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes:Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent,
  canActivate: [MetaGuard],
    data: {
          meta: {
            title: 'Home'
          }
    } }
];


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ]
})
export class PublicModule { }
