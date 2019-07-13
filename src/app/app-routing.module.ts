import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


export const routes:Routes = [
  { path: 'polls', loadChildren: './polls/polls.module#PollsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
