import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


export const routes:Routes = [
  {path: '', redirectTo: 'polls', pathMatch: 'full'},
  { path: 'polls', loadChildren: './polls/polls.module#PollsModule' },
  { path: 'vote', loadChildren: './vote/vote.module#VoteModule' },
  { path: 'account', loadChildren: './account/account.module#AccountModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
