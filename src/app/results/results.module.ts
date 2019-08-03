import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { ResultsComponent } from './pages/results/results.component';
import { GraphComponent } from './components/graph/graph.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TestComponent } from './pages/test/test.component';


export const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'not-found' },
  { path: 'not-found', pathMatch: 'full', component: NotFoundComponent },
  { path: 'test', pathMatch: 'full', component: TestComponent },
  { path: ':id/:round', component: ResultsComponent },
  { path: ':id/summary', component: ResultsComponent },
];


@NgModule({
  declarations: [ResultsComponent, GraphComponent, NotFoundComponent, TestComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class ResultsModule { }
