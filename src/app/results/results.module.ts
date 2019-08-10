import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { ResultsComponent } from './pages/results/results.component';
import { GraphComponent } from './components/graph/graph.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TestComponent } from './pages/test/test.component';

import { UserResolver } from '../shared/services/resolver.service';
import { ExplanationComponent } from './components/explanation/explanation.component';

export const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'not-found' },
  { path: 'not-found', pathMatch: 'full', component: NotFoundComponent },
  { path: 'test', pathMatch: 'full', component: TestComponent },
  { path: ':id/:round', resolve: { resolverUser: UserResolver}, component: ResultsComponent },
  { path: ':id/summary', resolve: { resolverUser: UserResolver}, component: ResultsComponent },
];


@NgModule({
  declarations: [ResultsComponent, GraphComponent, NotFoundComponent, TestComponent, ExplanationComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class ResultsModule { }
